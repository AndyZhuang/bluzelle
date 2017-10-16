#include "Node.h"
#include "NodeUtilities.h"
#include "WebSocket.h"

#include <boost/exception/all.hpp>
#include <iostream>

static Nodes s_nodes;
static boost::mutex *s_mutex = nullptr;
void print_message(const std::string &msg);
void kill_and_join_all_nodes(Nodes &nodes);
void make_introductions(const Nodes &nodes);

boost::mutex &get_mutex();

Nodes create_nodes(int number_of_nodes);

unsigned number_of_nodes_to_create(unsigned max_tasks, unsigned current_number_of_tasks)
{
    auto proportional = [](int max_tasks, int current_number_of_tasks)
        {
        return  (
                        std::max((int) 0, (int) (max_tasks - current_number_of_tasks))
                ) / 2;
        };
    auto integral = [] () {return 0;};
    auto derivative = [] () {return 0;};
    return proportional(max_tasks, current_number_of_tasks) + integral() + derivative();
}

void add_nodes(const Nodes& nodes)
{
    boost::mutex::scoped_lock lock(*s_mutex);
    s_nodes.insert(s_nodes.end(), nodes.begin(), nodes.end());
}

int main(/*int argc,char *argv[]*/)
{
    const uint8_t MAX_TASKS = 25;
    uint8_t numTasks = 2;
    get_mutex();


    WebSocket ws(&s_nodes);


    std::stringstream ss;
    try
        {
        s_nodes = create_nodes(numTasks);
        wait_for_all_nodes_to_start(s_nodes);
        make_introductions(s_nodes);

        while (!s_nodes.empty())
            {
            reaper(&s_nodes);

            // add new tasks + threads as old task/threads die to keep a constant
            // how many new threads do we need? Proportional
            int num_of_new_nodes = number_of_nodes_to_create( MAX_TASKS, s_nodes.size());
            if (num_of_new_nodes > 0)
                {
                Nodes nodes = create_nodes(num_of_new_nodes);
                add_nodes(nodes);
                }
            }

        // clean up
        print_message("The app is ending\n");
        kill_and_join_all_nodes(s_nodes);
        }
    catch (const std::exception &e)
        {
        std::cout << "Caught exception: [" << e.what() << "]\n";
        }
    catch(...)
        {
        std::cout << "caught exception\n";
        }

    return 0;
}

/////////

Node* create_node()
{
    return new Node();
}

Nodes create_nodes(int number_of_nodes)
{
    Nodes nodes;
    for(int i=0; i<number_of_nodes; ++i)
        {
        nodes.emplace_back(create_node());
        }
    return nodes;
}

void kill_nodes(const Nodes &nodes)
{
    for(auto node : nodes)
        {
        node->kill();
        }
}

void join_node_threads(const Nodes &nodes)
{
    for (auto node : nodes)
        {
        node->join();
        }
}

void kill_and_join_all_nodes(Nodes &nodes)
{
    kill_nodes(nodes);
    join_node_threads(nodes);
}

void make_introductions(const Nodes &nodes)
{
    Node *last_node = nullptr;
    for (auto node : nodes)
        {
        if (nullptr != last_node)
            {
            last_node->ping(node->get_thread_id());
            }
        last_node = node;
        }
}


boost::mutex &get_mutex()
{
    if (nullptr == s_mutex)
        {
        s_mutex = new boost::mutex();
        }
    return *s_mutex;
};

void print_message(const std::string &msg)
{
    //boost::unique_lock<boost::mutex> guard(*s_mutex, boost::defer_lock);
    //guard.lock();
    std::cout << msg;
    //guard.unlock();
}
