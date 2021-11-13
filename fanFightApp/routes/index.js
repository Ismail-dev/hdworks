const express = require('express');
const user = require('../models/user');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("OK");
});

router.get('/wallet/:userId/:entryFee/:discount', async (req, res, next) => {

  const [userId, entryFee, discount] = [Number(req.params.userId), Number(req.params.entryFee), Number(req.params.discount)];
  let [errorFlag, errorMessage] = [0, ""];

  // Verify input
  if ( !( typeof entryFee === "number" && entryFee >= 0 && typeof discount === "number" && discount >=0 ) ) {
    res.status(400).send("Invalid input");
  }

  let userWallet = await user.getUserWallet(userId);

  if ( userWallet && user.isValidWallet(userWallet.wallet) ) {

    const maxBonusUsagePercentage = 10;
    const discountedEntryFee = entryFee - ( entryFee * discount / 100 );
    const maxAmoutCanBeDeductedFromBonus = discountedEntryFee * maxBonusUsagePercentage / 100;
    let remainingAmountToBeDeducted = discountedEntryFee;

    let [ bonusToBeDeducted, depositToBeDeducted, winningsToBeDeducted ] = [ 0,0,0 ];

    // Deduct amount from bonus, 
    // deduct max amount if available bonus is more than max amount deductable from bonus 
    // else deduct all the available bonus and set it to zero
    if ( userWallet.wallet.bonus > maxAmoutCanBeDeductedFromBonus ) {
      bonusToBeDeducted = maxAmoutCanBeDeductedFromBonus;
      remainingAmountToBeDeducted -= maxAmoutCanBeDeductedFromBonus;
    } else {
      remainingAmountToBeDeducted -= userWallet.wallet.bonus;
      bonusToBeDeducted = userWallet.wallet.bonus;
    }

    // Deduct amount from diposit, 
    // deduct all remaining amount if available diposit is more 
    // else deduct all the available diposit and set it to zero
    if ( userWallet.wallet.diposit >= remainingAmountToBeDeducted ) {
      depositToBeDeducted = remainingAmountToBeDeducted;
      remainingAmountToBeDeducted = 0;
    } else {
      remainingAmountToBeDeducted -= userWallet.wallet.diposit;
      depositToBeDeducted = userWallet.wallet.diposit;
    }

    // Deduct amount from winings, 
    // deduct all amount if available winings is more than amount deductable 
    // else return error saying not enough account balence
    if ( userWallet.wallet.winnings >= remainingAmountToBeDeducted ) {
      winningsToBeDeducted = remainingAmountToBeDeducted;
    } else {
      errorFlag = 1;
      errorMessage = "Do not have enough money in account";
    }

    if (errorFlag) {
      res.status(400).send(errorMessage);
    } else {
      // All is good so perform the actual deductions from wallet
      userWallet.wallet.bonus -= bonusToBeDeducted;
      userWallet.wallet.diposit -= depositToBeDeducted;
      userWallet.wallet.winnings -= winningsToBeDeducted;
      res.status(200).send(userWallet);
    }
    
  } else {
    res.status(400).send("Invalid user");
  }

});

module.exports = router;







