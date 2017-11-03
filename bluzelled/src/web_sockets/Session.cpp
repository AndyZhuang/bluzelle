#include "web_sockets/Session.h"

#include "services/Ping.h"
#include "services/GetAllNodes.h"
#include "services/CountNodes.h"
#include "services/SetMaxNodes.h"
#include "services/GetMaxNodes.h"
#include "services/GetMinNodes.h"
#include "services/UpdateNodes.h"
#include "services/RemoveNodes.h"

Nodes *get_all_nodes();


// Report a failure
void
fail(boost::system::error_code ec, char const *what) {
    std::cerr << what << ": " << ec.message() << "\n";
}

Session::Session(tcp::socket socket)
        : ws_(std::move(socket)), strand_(ws_.get_io_service()) {
    auto nodes = get_all_nodes();

    services_.add_service("ping", new Ping());
    services_.add_service("getAllNodes", new GetAllNodes(nodes));
    services_.add_service("countNodes", new CountNodes(nodes));
    services_.add_service("setMaxNodes", new SetMaxNodes());
    services_.add_service("getMaxNodes", new GetMaxNodes());
    services_.add_service("getMinNodes", new GetMinNodes());
    services_.add_service("updateNodes", new GetAllNodes(nodes));
    ///services_.add_service("removeNodes", new RemoveNodes());

}

// Start the asynchronous operation
void
Session::run() {
    // Accept the websocket handshake
    ws_.async_accept(
            strand_.wrap(std::bind(
                    &Session::on_accept,
                    shared_from_this(),
                    std::placeholders::_1)));
}

void
Session::on_accept(boost::system::error_code ec) {
    if (ec)
        return fail(ec, "accept");

    // Read a message
    do_read();
}

void
Session::do_read() {
    // Read a message into our buffer
    ws_.async_read(
            buffer_,
            strand_.wrap(std::bind(
                    &Session::on_read,
                    shared_from_this(),
                    std::placeholders::_1,
                    std::placeholders::_2)));
}

void
Session::on_read(
        boost::system::error_code ec,
        std::size_t bytes_transferred) {
    boost::ignore_unused(bytes_transferred);

    // This indicates that the session was closed
    if (ec == websocket::error::closed)
        return;

    if (ec)
        fail(ec, "read");

    std::stringstream ss;
    ss << boost::beast::buffers(buffer_.data());

    pt::ptree request;
    pt::read_json(ss, request);

    std::string command = request.get<std::string>("cmd");

    std::cout << " **** command:" << command << "\n";

    std::string response = services_(command, ss.str());

    std::cout
            << " ******* response ["
            << response
            << "]\n";

    ws_.async_write(
            boost::asio::buffer(response),
            std::bind(
                    &Session::on_write,
                    shared_from_this(),
                    std::placeholders::_1,
                    std::placeholders::_2));


    state_ = set_state(request);
    seq = request.get<int>("seq");
}

void
Session::on_write(
        boost::system::error_code ec,
        std::size_t bytes_transferred) {
    boost::ignore_unused(bytes_transferred);

    if (ec)
        return fail(ec, "write");

    // Clear the buffer
    buffer_.consume(buffer_.size());

    if (state_ == SessionState::Started)
        {
        auto request = boost::format("{\"seq\": %d}") % ++seq;
        std::string response = services_("getAllNodes", boost::str(request));

        if (response.length() > 0) // Send updated nodes status.
            {
            std::cout << " ******* " << std::endl << response << std::endl;
            ws_.write(boost::asio::buffer(response));
            state_ = SessionState::Started; // Send all nodes once.
            }
        }

    buffer_.consume(buffer_.size());

    // Do another read
    do_read();
}

SessionState
Session::set_state(
        const pt::ptree &request) {
    if (request.get<std::string>("cmd") == "getMaxNodes")
        return SessionState::Starting;

    if (request.get<std::string>("cmd") == "getMinNodes")
        return SessionState::Started;

    return state_;
}

void
Session::send_remove_nodes(
        const std::string &name) {
    auto request = boost::format("{\"seq\": %d}") % ++seq;
    RemoveNodes removeNodesCmd(name);
    //std::string response = removeNodesCmd.operator()(boost::str(request));

    // {"cmd":"removeNodes","data":["0x07"]}
    auto f = boost::format("{\"cmd\":\"removeNodes\", \"data\":[\"%s\"]}") % name;
    std::string response = boost::str(f);

    if (response.length() > 0) // Send removed nodes.
        {
        std::cout << " ******* " << std::endl << response << std::endl;
        ws_.write(boost::asio::buffer(response));
        }
}

void
Session::send_update_nodes(
        const std::string &name) {
    auto request = boost::format("{\"seq\": %d}") % ++seq;

    // {"cmd":"updateNodes","data":[{"address":"0x0e"}]}
    auto f = boost::format("{\"cmd\":\"updateNodes\",\"data\":[{\"address\":\"%s\"}]}") % name;
    std::string response = boost::str(f);

    if (response.length() > 0)
        {
        std::cout << " ******* " << std::endl << response << std::endl;
        ws_.write(boost::asio::buffer(response));
        }
}