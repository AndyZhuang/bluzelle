#include "RaftState.h"

#include "RaftLeaderState.h"
#include "RaftFollowerState.h"
#include "RaftCandidateState.h"


void RaftState::set_next_state_follower()
{
    next_state_ = std::make_unique<RaftFollowerState>(ios_,
                                                      storage_,
                                                      command_factory_,
                                                      peer_queue_,
                                                      peers_,
                                                      handler_,
                                                      timer_rearmer_);
}

void RaftState::set_next_state_leader()
{
    next_state_ = std::make_unique<RaftLeaderState>(ios_,
                                                    storage_,
                                                    command_factory_,
                                                    peer_queue_,
                                                    peers_,
                                                    handler_,
                                                    timer_rearmer_);
}

void RaftState::set_next_state_candidate()
{
    next_state_ = std::make_unique<RaftCandidateState>(ios_,
                                                       storage_,
                                                       command_factory_,
                                                       peer_queue_,
                                                       peers_,
                                                       handler_,
                                                       timer_rearmer_);
}
