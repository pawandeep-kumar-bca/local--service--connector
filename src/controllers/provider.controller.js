const providerModel = require("../models/provider.model");
const uploadImage = require("../config/imagekit");
const imagekit = require("@imagekit/nodejs");

async function createProvider(req, res) {
  try {
    const { providerName, phoneNumber, price, experience, city } = req.body;
    const userId = req.user.id;

    const existingProvider = await providerModel.findOne({ userId });

    if (existingProvider) {
      return res.status(400).json({
        message: "Provider profile already exists",
      });
    }

    // upload documents
    const aadharCardData = await uploadImage(
      req.files.aadharCard[0],
      `${userId}-${Date.now()}-aadharCard`,
      "providers/documents",
    );

    const certificateData = await uploadImage(
      req.files.certificate[0],
      `${userId}-${Date.now()}-certificate`,
      "providers/documents",
    );

    // optional profile image
    let profileImageData = null;

    if (req.files && req.files.profileImage) {
      profileImageData = await uploadImage(
        req.files.profileImage[0],
        `${userId}-${Date.now()}-profileImage`,
        "providers/profile",
      );
    }

    const provider = await providerModel.create({
      providerName,
      phoneNumber,
      price,
      experience,
      city,
      userId,

      documents: {
        aadharCard: {
          url: aadharCardData.url,
          fileId: aadharCardData.fileId,
        },
        certificate: {
          url: certificateData.url,
          fileId: certificateData.fileId,
        },
      },

      profileImage: profileImageData
        ? {
            url: profileImageData.url,
            fileId: profileImageData.fileId,
          }
        : undefined,
    });

    res.status(201).json({
      message: "Provider created successfully",
      provider,
    });
  } catch (error) {
    console.error("create provider error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getProvider(req, res) {
  try {
    const userId = req.user.id;
    const providerExists = await providerModel.findOne({ userId });
    if (!providerExists) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    return res.status(200).json({
      message: "provider profile fetch successfully",
      provider: providerExists,
    });
  } catch (err) {
    console.error("get provider error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateProvider(req, res) {
  try {
    const { providerName, phoneNumber, price, experience, city, availability } =
      req.body;
    const userId = req.user.id;

    const providerExists = await providerModel.findOne({ userId });

    if (!providerExists) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    let newImageData = null;

    // check if new image uploaded
    if (req.files && req.files.profileImage) {
      // delete old image if exists
      if (providerExists.profileImage && providerExists.profileImage.fileId) {
        await imagekit.deleteFile(providerExists.profileImage.fileId);
      }

      // upload new image
      newImageData = await uploadImage(
        req.files.profileImage[0],
        `${userId}-${Date.now()}-profileImage`,
        "providers/profile",
      );
    }

    // partial updates
    if (providerName) providerExists.providerName = providerName;
    if (phoneNumber) providerExists.phoneNumber = phoneNumber;
    if (price) providerExists.price = price;
    if (experience) providerExists.experience = experience;
    if (city) providerExists.city = city;

    if (newImageData) {
      providerExists.profileImage = {
        url: newImageData.url,
        fileId: newImageData.fileId,
      };
    }

    if (availability !== undefined) {
      providerExists.availability = availability;
    }

    await providerExists.save();

    return res.status(200).json({
      message: "Provider profile updated successfully",
      provider: providerExists,
    });
  } catch (err) {
    console.error("update provider profile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getProviders(req, res) {
  try {
    const providers = await providerModel.find();
    let count = providers.length;
    if (providers.length === 0) {
      return res
        .status(200)
        .json({ message: "Providers not found", providers, count });
    }

    return res.status(200).json({
      message: "all provider fetch successfully",
      providers,
      count,
    });
  } catch (err) {
    console.error("Get providers error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getOneProviderDetails(req,res){
try{ 
    const providerId = req.params.id
 
 const providerExists = await providerModel.findById(providerId)
  if(!providerExists) {
    return res.status(404).json({message:'Wrong Provider Id'})
  }
  return res.status(200).json({
    message:"provider details fetch successfully",
    providerExists
  })}catch(err){
    console.error('One Provider details error:',err);
    return res.status(500).json({message:'Internal server error'})
    
  }
}


module.exports = {
  createProvider,
  getProvider,
  updateProvider,
  getProviders,
  getOneProviderDetails
};
