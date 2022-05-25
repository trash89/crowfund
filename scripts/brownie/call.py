from brownie import accounts, network, exceptions, Ballot
from scripts.brownie.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
import pytest


def main():
    ballot = Ballot[-1]
    alice = get_account()
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        bob = get_account(index=1)
        luke = get_account(index=2)
    else:
        bob = get_account(id="m2")
        luke = get_account(id="m3")

    print("Giving the rights to vote to bob...")
    tx = ballot.giveRightToVote(bob.address, {"from": alice})
    tx.wait(1)
    print("bob has the right to vote...")

    print("Giving the rights to vote to luke...")
    tx = ballot.giveRightToVote(luke.address, {"from": alice})
    tx.wait(1)
    print("luke has the right to vote...")

    print("bob delegates his vote to luke...")
    tx = ballot.delegate(luke.address, {"from": bob})
    tx.wait(1)
    print("bob delegated his vote to luke")

    with pytest.raises(exceptions.VirtualMachineError):
        print("bob is voting the first proposal")
        tx = ballot.vote(0, {"from": bob})
        tx.wait(1)
        print("bob voted the first proposal")

    print("luke is voting the second proposal")
    tx = ballot.vote(1, {"from": luke})
    tx.wait(1)
    print("luke voted the second proposal")

    winner = ballot.winnerName()
    print(f"Winner name is {winner}")
