const express = require("express");
const router = express.Router();
const Accounts = require("../models/Accounts");
const Dc = require("../models/Dc");

// {Create Operation} ADMIN
router.post("/create", async (req, res) => {
  let success = false;
  try {
    //store data
    let {
      name,
      mobileNumbers,
      address,
      guarranter,
      idCardNumber,
      status,
      accountType,
    } = req.body; // de-Structure

    if (guarranter === "") {
      guarranter = "خود";
    }

    const dup = await Accounts.findOne({
      name: name,
    });
    if (!dup) {
      //Check guarranter account
      const guarranterAccount = await Accounts.findOne({ name: guarranter });
      if (!guarranterAccount && guarranter !== "خود") {
        success = false;
        res.send({
          success,
          error:
            " گارنٹراکاؤنٹ سسٹم میں موجود نہیں ہے۔ براہ کرم پہلے اس شخص کا اکاؤنٹ بنائیں",
        });
      } else {
        let accounts = await Accounts.create({
          name,
          mobileNumbers, // Use the array of mobile numbers
          address,
          guarranter,
          idCardNumber, // Add the idCardNumber
          status,
          accountType,
        });
        success = true;
        res.send({ success, accounts });
      }
    } else {
      res.send({
        success,
        error: "اس عنوان کے ساتھ ایک اور اکاؤنٹ پہلے سے موجود ہے",
      });
    }
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Read/Fetch Operation} ADMIN
router.get("/read", async (req, res) => {
  const accounts = await Accounts.find({}); // fetch all data
  res.json(accounts);
});

// {Search Operation} ADMIN
router.get("/search/:name", async (req, res) => {
  let success = false;
  try {
    const accounts = await Accounts.findOne({
      name: new RegExp(req.params.name, "i"),
    }); //
    success = true;
    res.send({ success, accounts });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Search All Operation} ADMIN
router.get("/searchAll/:name", async (req, res) => {
  let success = false;
  try {
    const accounts = await Accounts.find({
      name: new RegExp(req.params.name, "i"),
    }); // fetch all apps where keyword like this // fetch data according to given keyword
    success = true;
    res.send({ success, accounts });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Update Operation} ADMIN
router.put("/update/:id", async (req, res) => {
  let success = false;
  try {
    let {
      name,
      mobileNumbers,
      address,
      guarranter,
      titleChange,
      idCard,
      status,
      accountType,
    } = req.body; //De-Structure

    if (guarranter === "") {
      guarranter = "خود";
    }

    // Create a new data object
    const newData = {};
    if (name) {
      newData.name = name;
    }
    if (mobileNumbers) {
      newData.mobileNumbers = mobileNumbers;
    }
    if (address) {
      newData.address = address;
    }
    if (guarranter) {
      newData.guarranter = guarranter;
    }
    if (titleChange) {
      newData.titleChange = titleChange;
    }
    if (idCard) {
      newData.idCardNumber = idCard;
    }
    if (status) {
      newData.status = status;
    }
    if (accountType) {
      newData.accountType = accountType;
    }
    //Find the document to be updated and update it
    let accounts = await Accounts.findById(req.params.id);
    if (!accounts) {
      success = false;
      res.send({
        success,
        error: "Document not found",
      });
    } else {
      if (titleChange) {
        //it will only proceed if there is change in account title
        const dup = await Accounts.findOne({
          name: name,
        });
        if (!dup) {
          //Check wheather guarranter account exists or not
          const guarranterAccount = await Accounts.findOne({
            name: guarranter,
          });
          if (!guarranterAccount && guarranter !== "خود") {
            success = false;
            res.send({
              success,
              error:
                " گارنٹراکاؤنٹ سسٹم میں موجود نہیں ہے۔ براہ کرم پہلے اس شخص کا اکاؤنٹ بنائیں",
            });
          } else {
            const accountId = req.params.id;

            // Retrieve the name from the Accounts model using the ID
            const account = await Accounts.findById(accountId);
            const nameToUpdate = account.name;

            // Update all documents in the Dc model where the 'name' field matches 'nameToUpdate'
            await Dc.updateMany(
              { name: nameToUpdate },
              { $set: { name: name } }
            );

            accounts = await Accounts.findByIdAndUpdate(
              req.params.id,
              { $set: newData },
              { new: true }
            );
            success = true;
            res.send({
              success,
              message:
                "Document has been updated at Document id : " + req.params.id,
            });
          }
        } else {
          {
            success = false;
            res.send({
              success,
              error: "اس نام کے ساتھ ایک اور اکاؤنٹ پہلے سے موجود ہے",
            });
          }
        }
      } else {
        //Check wheather guarranter account exists or not
        const guarranterAccount = await Accounts.findOne({
          name: guarranter,
        });
        if (!guarranterAccount && guarranter !== "خود") {
          success = false;
          res.send({
            success,
            error:
              " گارنٹراکاؤنٹ سسٹم میں موجود نہیں ہے۔ براہ کرم پہلے اس شخص کا اکاؤنٹ بنائیں",
          });
        } else {
          accounts = await Accounts.findByIdAndUpdate(
            req.params.id,
            { $set: newData },
            { new: true }
          );
          success = true;
          res.send({
            success,
            message:
              "Document has been updated at Document id : " + req.params.id,
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Delete Operation} ADMIN
router.delete("/delete/:id", async (req, res) => {
  let success = false;
  try {
    //Find the Document to be deleted and delete it
    let accounts = await Accounts.findById(req.params.id);
    if (!accounts) {
      res.status(404).send("Document not found");
    } else {
      accounts = await Accounts.findByIdAndDelete(req.params.id);
      success = true;
      res.send({
        success,
        message: "Document at id : " + req.params.id + " Has been deleted",
      });
    }
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

router.get("/accountsBlock", async (req, res) => {
  try {
    const totalAccounts = await Accounts.countDocuments({});

    const regularAccounts = await Accounts.countDocuments({
      status: "Regular",
    });

    const highRiskAccounts = await Accounts.countDocuments({
      status: "High Risk",
    });

    const blackListedAccounts = await Accounts.countDocuments({
      status: "Black List",
    });

    const result = {
      totalAccounts,
      regularAccounts,
      highRiskAccounts,
      blackListedAccounts,
    };

    res.json(result);
  } catch (error) {
    // Handle any errors here
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
