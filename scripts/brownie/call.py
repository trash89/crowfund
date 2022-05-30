from brownie import accounts, chain, network, exceptions, CrowToken, Crowfund
from scripts.brownie.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
import pytest
import datetime
import time


def main():
    crowtoken = CrowToken[-1]
    crowfund = Crowfund[-1]

    alice = get_account()
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        bob = get_account(index=1)
        peter = get_account(index=2)
    else:
        bob = get_account(id="m2")
        peter = get_account(id="m3")

    alice_transfer_tokens(crowtoken, get_account(index=1), 50*10**18)
    alice_transfer_tokens(crowtoken, get_account(index=2), 20*10**18)

    # alice launch a campaign
    goal = 100*10**18
    startAt = chain.time()+60  # +60sec
    # print(datetime.datetime.fromtimestamp(startAt))
    endAt = startAt+60*60*3  # +3h
    campaignId = launchCampaign(crowfund, get_account(), goal, startAt, endAt)
    approve_tokens(get_account(), crowtoken, crowfund, 100*10**18)
    print("wait 60 secs...")
    time.sleep(60)
    pledge_tokens(campaignId, 20*10**18, get_account(), crowfund)

    # bob launch a campaign
    goal = 150*10**18
    startAt = chain.time()+60  # +60sec
    endAt = startAt+60*60*3  # +3h
    campaignId = launchCampaign(
        crowfund, get_account(index=1), goal, startAt, endAt)
    approve_tokens(get_account(index=1), crowtoken, crowfund, 50*10**18)
    print("wait 60 secs...")
    time.sleep(60)
    pledge_tokens(campaignId, 50*10**18, get_account(index=1), crowfund)


def alice_transfer_tokens(which_token, to, how_much):
    print(f"Alice transfers tokens to {to}")
    tx = which_token.transfer(to, how_much, {"from": get_account()})
    tx.wait(1)


def approve_tokens(who_approves, which_token, spender, how_much):
    print(f"{who_approves} approves {how_much} tokens to CrowdFund contract")
    tx = which_token.approve(spender, how_much, {"from": who_approves})
    tx.wait(1)


def pledge_tokens(campaignId, how_much, who_pledge, to_whom):
    print(f"{who_pledge} pledge {how_much} tokens to CrowdFund contract")
    tx = to_whom.pledge(campaignId, how_much, {"from": who_pledge})
    tx.wait(1)


def unpledge_tokens(campaignId, how_much, who_unpledge, to_whom):
    print(f"{who_unpledge} unpledge {how_much} tokens to CrowdFund contract")
    tx = to_whom.unpledge(campaignId, how_much, {"from": who_unpledge})
    tx.wait(1)


def launchCampaign(crowfund, who_launch, goal, startAt, endAt):
    print(f"launch a campaign with a goal of {goal} tokens")
    tx = crowfund.launch(goal, startAt, endAt, {
                         "from": who_launch})
    tx.wait(1)
    campaignId = tx.return_value
    print(f"Launched Campaign #{campaignId}")
    return campaignId
