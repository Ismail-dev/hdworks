let users = [
    { 
        "id": 1, 
        "name": "Ismail", 
        "wallet": { 
            "diposit": 100, 
            "bonus": 60, 
            "winnings": 340
        }
    },
    { 
        "id": 2, 
        "name": "Rohan", 
        "wallet": { 
            "diposit": 200, 
            "bonus": 120, 
            "winnings": 680
        }
    },
    { 
        "id": 4, 
        "name": "Rupa", 
        "wallet": { 
            "diposit": 10, 
            "bonus": 5, 
            "winnings": 20
        }
    },
];
  
module.exports.getUserWallet = userId => users.find( (e) => e.id == userId);

module.exports.isValidWallet = (wallet) => {

    if (
        wallet && 
        typeof wallet.diposit === "number" && wallet.diposit >= 0 &&
        typeof wallet.bonus === "number" && wallet.bonus >= 0 &&
        typeof wallet.winnings === "number" && wallet.winnings >= 0 
    ) {
        return true;
    } else {
        return false;
    }
};
