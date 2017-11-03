#ifndef KEPLER_SESSION_H
#define KEPLER_SESSION_H

#include "services/Services.h"


#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/strand.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <algorithm>
#include <cstdlib>
#include <functional>
#include <iostream>
#include <memory>
#include <string>
#include <thread>
#include <vector>

using tcp = boost::asio::ip::tcp;               // from <boost/asio/ip/tcp.hpp>
namespace websocket = boost::beast::websocket;  // from <boost/beast/websocket.hpp>
namespace pt = boost::property_tree;

enum class SessionState {
    Unknown,
    Starting,
    Started,
    Finishing,
    Finished,
};

void
fail(boost::system::error_code ec, char const *what);

class Session : public std::enable_shared_from_this<Session> {
    websocket::stream<tcp::socket> ws_;
    boost::asio::io_service::strand strand_;
    boost::beast::multi_buffer buffer_;
    Services services_;

    SessionState state_ = SessionState::Unknown;
    size_t seq = 0;

    const unsigned int send_interval_millisecs_ = 2000;

public:
    explicit
    Session(tcp::socket socket); // Take ownership of the socket

    void
    run();

    void
    on_accept(boost::system::error_code ec);

    void
    do_read();

    void
    on_read(
            boost::system::error_code ec,
            std::size_t bytes_transferred);

    void
    on_write(
            boost::system::error_code ec,
            std::size_t bytes_transferred);

    SessionState
    set_state(
            const pt::ptree &request);

    void
    send_remove_nodes(
            const std::string &name);

    void
    send_update_nodes(
            const std::string &name);
};


#endif //KEPLER_SESSION_H
