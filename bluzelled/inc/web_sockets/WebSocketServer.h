#ifndef KEPLER_WEBSOCKETSERVER_H
#define KEPLER_WEBSOCKETSERVER_H

#include "web_sockets/Listener.h"

#include <boost/asio.hpp>
#include <boost/thread.hpp>

class WebSocketServer
{
    boost::asio::ip::address    address_;
    unsigned short                port_;
    size_t                      threads_;
public:
    WebSocketServer(const char* ip_address, unsigned short port, unsigned short threads)
    //:address_(boost::asio::ip::address::from_string(ip_address)),port_(port),threads_(threads)
    {
        address_ = boost::asio::ip::address::from_string(ip_address);
        port_ = static_cast<unsigned short>(port);
        threads_ = std::max<std::size_t>(1, threads);
    }

    void operator()()
    {
        // The io_service is required for all I/O
        boost::asio::io_service ios{threads_};

        // Create and launch a listening port
        std::make_shared<Listener>(ios, tcp::endpoint{address_, port_})->run();

        // Run the I/O service on the requested number of threads
        std::vector<std::thread>    v_;
        v_.reserve(threads_ - 1);
        for (auto i = threads_ - 1; i > 0; --i)
            v_.emplace_back(
                    [&ios]
                        {
                        ios.run();
                        });
        ios.run();
    }
};

#endif //KEPLER_WEBSOCKETSERVER_H
