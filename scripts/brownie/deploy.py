from brownie import chain, CrowToken, Crowfund
from scripts.brownie.helpful_scripts import get_account, update_front_end

INITIAL_MINT = 10000   # 10000 tokens


def main():
    crowtoken = deployCrowToken(update_front_end_flag=True)
    crowfund = deployCrowfund(crowtoken.address, update_front_end_flag=True)


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
