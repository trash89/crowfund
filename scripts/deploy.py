from brownie import chain, accounts, CrowdToken, CrowdFund
import time

DECIMALS = 10**18
alice = accounts[0]
bob = accounts[1]
charlie = accounts[2]
luke = accounts[3]


def main():
    crowdToken, crowdFund = deploy_contracts(alice)

    print_values(alice, bob, charlie, luke, crowdToken, crowdFund)

    alice_transfer_tokens(crowdToken, bob, 50)
    alice_transfer_tokens(crowdToken, charlie, 20)
    alice_transfer_tokens(crowdToken, luke, 80)

    print_values(alice, bob, charlie, luke, crowdToken, crowdFund)

    approve_tokens(alice, crowdToken, crowdFund, 100)
    approve_tokens(bob, crowdToken, crowdFund, 50)
    approve_tokens(charlie, crowdToken, crowdFund, 20)
    approve_tokens(luke, crowdToken, crowdFund, 80)

    print_values(alice, bob, charlie, luke, crowdToken, crowdFund)
    goal = 100
    startAt = chain.time()+2
    endAt = startAt+6
    print(f"Alice launch a campaign with a goal of {goal} tokens")
    tx = crowdFund.launch(goal, startAt, endAt, {"from": alice})
    tx.wait(1)
    campaignId = tx.return_value
    print_values(alice, bob, charlie, luke, crowdToken, crowdFund)

    pledge_tokens(campaignId, 20, alice, crowdFund)
    pledge_tokens(campaignId, 50, bob, crowdFund)
    pledge_tokens(campaignId, 20, charlie, crowdFund)
    pledge_tokens(campaignId, 80, luke, crowdFund)
    print_values(alice, bob, charlie, luke, crowdToken, crowdFund)

    unpledge_tokens(campaignId, 10, luke, crowdFund)
    print_values(alice, bob, charlie, luke, crowdToken, crowdFund)

    wait_time = 10
    print(f"Waiting {wait_time} secs...")
    time.sleep(10)

    print("Alice claim the campaign")
    tx = crowdFund.claim(campaignId, {"from": alice})
    tx.wait(1)
    print_values(alice, bob, charlie, luke, crowdToken, crowdFund)

    print("Luke transfers back his tokens to Alice")
    tx = crowdToken.transfer(alice, crowdToken.balanceOf(luke), {"from": luke})
    tx.wait(1)
    print_values(alice, bob, charlie, luke, crowdToken, crowdFund)


def deploy_contracts(from_who):
    print("Deploying the CrowdToken(ERC20) token..")
    crowdToken = CrowdToken.deploy(1000000, {"from": from_who})
    print(f"crowdToken deployed at {crowdToken}")

    print("Deploying the CrowdFund contract..")
    crowdFund = CrowdFund.deploy(crowdToken.address, {"from": from_who})
    print(f"CrowdFund contract deployed at {crowdFund}")
    return crowdToken, crowdFund


def alice_transfer_tokens(which_token, to, how_much):
    print(f"Alice transfers tokens to {to}")
    tx = which_token.transfer(to, how_much, {"from": alice})
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


def print_values(alice, bob, charlie, luke, crowdToken, crowdFund):
    bal_alice = crowdToken.balanceOf(alice)
    bal_bob = crowdToken.balanceOf(bob)
    bal_charlie = crowdToken.balanceOf(charlie)
    bal_luke = crowdToken.balanceOf(luke)
    bal_crowdFund = crowdToken.balanceOf(crowdFund)
    print(
        f"Alice: {bal_alice}, Bob: {bal_bob}, Charlie: {bal_charlie}, Luke: {bal_luke}")
    print(f"CrowdFund: {bal_crowdFund}")
