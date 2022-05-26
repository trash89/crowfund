from brownie import chain, CrowToken, Crowfund

from scripts.brownie.helpful_scripts import get_account, update_front_end

INITIAL_MINT = 10000   # 10000 tokens


def main():
    crowtoken = deployCrowToken(update_front_end_flag=True)
    crowfund = deployCrowfund(crowtoken.address, update_front_end_flag=True)
    # alice launch a campaign
    goal = 100
    startAt = chain.time()+15
    endAt = startAt+20
    campaignId = launchCampaign(crowfund, get_account(), goal, startAt, endAt)
    approve_tokens(get_account(), crowtoken, crowfund, 100)
    pledge_tokens(campaignId, 20, get_account(), crowfund)

    # bob launch a campaign
    goal = 150
    startAt = chain.time()+10
    endAt = startAt+20
    campaignId = launchCampaign(
        crowfund, get_account(index=1), goal, startAt, endAt)
    approve_tokens(get_account(index=1), crowtoken, crowfund, 50)
    pledge_tokens(campaignId, 50, get_account(index=1), crowfund)


def approve_tokens(who_approves, which_token, spender, how_much):
    print(f"{who_approves} approves {how_much} tokens to CrowdFund contract")
    tx = which_token.approve(spender, how_much, {"from": who_approves})
    tx.wait(1)


def pledge_tokens(campaignId, how_much, who_pledge, to_whom):
    print(f"{who_pledge} pledge {how_much} tokens to CrowdFund contract")
    tx = to_whom.pledge(campaignId, how_much, {"from": who_pledge})
    tx.wait(1)


def deployCrowToken(update_front_end_flag=True):
    print("Deploying CrowToken contract...")
    crowtoken = CrowToken.deploy(INITIAL_MINT, {"from": get_account()})
    print(f"Deployed CrowToken at {crowtoken}...")
    if update_front_end_flag:
        update_front_end()
    return crowtoken


def deployCrowfund(token_address, update_front_end_flag=True):
    print("Deploying Crowfund contract...")
    crowfund = Crowfund.deploy(token_address, {"from": get_account()})
    print(f"Deployed Crowfund at {crowfund}...")
    if update_front_end_flag:
        update_front_end()
    return crowfund


def launchCampaign(crowfund, who_launch, goal, startAt, endAt):
    print(f"Alice launch a campaign with a goal of {goal} tokens")
    tx = crowfund.launch(goal, startAt, endAt, {
                         "from": who_launch})
    tx.wait(1)
    campaignId = tx.return_value
    print(f"Launched Campaign #{campaignId}")
    return campaignId
