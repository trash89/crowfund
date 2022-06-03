from brownie import chain, CrowdToken, Crowdfund
from scripts.brownie.helpful_scripts import get_account, update_front_end

INITIAL_MINT = 10000   # 10000 tokens


def main():
    crowdtoken = deployCrowdToken(update_front_end_flag=True)
    crowdfund = deployCrowdfund(crowdtoken.address, update_front_end_flag=True)


def deployCrowdToken(update_front_end_flag=True):
    print("Deploying CrowdToken contract...")
    crowdtoken = CrowdToken.deploy(INITIAL_MINT, {"from": get_account()})
    print(f"Deployed CrowdToken at {crowdtoken}...")
    if update_front_end_flag:
        update_front_end()
    return crowdtoken


def deployCrowdfund(token_address, update_front_end_flag=True):
    print("Deploying Crowdfund contract...")
    crowdfund = Crowdfund.deploy(token_address, {"from": get_account()})
    print(f"Deployed Crowdfund at {crowdfund}...")
    if update_front_end_flag:
        update_front_end()
    return crowdfund
