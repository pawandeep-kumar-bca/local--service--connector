const providerModel = require("../models/provider.model");
const uploadImage = require("../config/imagekit");
const imagekit = require("@imagekit/nodejs");

async function createProvider(req, res) {
  try {
    const { providerName, phoneNumber, price, experience, city, lat, lng } =
      req.body;

    const userId = req.user.id;

    // validate location
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: "lat and lng are required",
      });
    }

    // check provider already exists
    const existingProvider = await providerModel.findOne({ userId });

    if (existingProvider) {
      return res.status(400).json({
        message: "Provider profile already exists",
      });
    }

    const provider = await providerModel.create({
      providerName,
      phoneNumber,
      price,
      experience,
      city,
      userId,

      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      },
    });

    return res.status(201).json({
      message: "Provider profile created successfully",
      provider,
    });
  } catch (error) {
    console.error("create provider error:", error);

    return res.status(500).json({
      message: "Internal server error",
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

async function getOneProviderDetails(req, res) {
  try {
    const providerId = req.params.id;

    const providerExists = await providerModel.findById(providerId);
    if (!providerExists) {
      return res.status(404).json({ message: "Wrong Provider Id" });
    }
    return res.status(200).json({
      message: "provider details fetch successfully",
      providerExists,
    });
  } catch (err) {
    console.error("One Provider details error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function nearbySearchLocation(req, res) {
  try {
    let { lat, lng, radius } = req.query;

    // validation
    if (lat === undefined || lng === undefined || radius === undefined) {
      return res.status(400).json({
        message: "lat, lng and radius are required",
      });
    }

    // convert string → number
    lat = Number(lat);
    lng = Number(lng);
    radius = Number(radius);

    // convert km → meters
    const distance = radius * 1000;

    // geo search
    const providers = await providerModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: distance,
        },
      },
    });

    // if no providers
    if (providers.length === 0) {
      return res.status(200).json({
        message: "No providers found nearby",
        providers: [],
      });
    }

    // success
    return res.status(200).json({
      message: "Nearby providers found",
      totalProviders: providers.length,
      providers,
    });
  } catch (err) {
    console.error("Nearby provider error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function recommendedProviders(req, res) {
  try {
    const providers = await providerModel
      .find({
        rating: { $gte: 4 }, // rating >= 4
        totalReview: { $gte: 10 }, // reviews >= 10
        status: "Approved",
        verificationStatus: "verified",
        availability: true,
      })
      .sort({ rating: -1, totalReview: -1 }) // highest rating first
      .lean();

    if (providers.length === 0) {
      return res.status(200).json({
        message: "No recommended providers found",
        providers: [],
      });
    }

    return res.status(200).json({
      message: "Recommended providers fetched successfully",
      totalProviders: providers.length,
      providers,
    });
  } catch (err) {
    console.error("recommended provider error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function availabilityProvider(req, res) {
  try {
    const { availability } = req.body;
    const providerId = req.user.id;
    const provider = await providerModel.findOne({ userId: providerId });

    if (!provider) {
      return res
        .status(404)
        .json({ message: "Provider profile not found", provider: [] });
    }
    if (availability === undefined) {
      return res.status(400).json({ message: "availability is required" });
    }
    provider.availability = availability;
    await provider.save();
    return res.status(200).json({
      message: "provider availability updated successfully",
      provider,
    });
  } catch (err) {
    console.error("availability Provider error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function uploadProviderDocuments(req, res) {
  try {
    const userId = req.user.id;

    const provider = await providerModel.findOne({ userId });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    if (!req.files || !req.files.aadharCard || !req.files.certificate) {
      return res.status(400).json({
        message: "Aadhar card and certificate are required",
      });
    }

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

    let profileImageData = null;

    if (req.files.profileImage) {
      profileImageData = await uploadImage(
        req.files.profileImage[0],
        `${userId}-${Date.now()}-profileImage`,
        "providers/profile",
      );
    }

    provider.documents = {
      aadharCard: {
        url: aadharCardData.url,
        fileId: aadharCardData.fileId,
      },
      certificate: {
        url: certificateData.url,
        fileId: certificateData.fileId,
      },
    };

    if (profileImageData) {
      provider.profileImage = {
        url: profileImageData.url,
        fileId: profileImageData.fileId,
      };
    }

    await provider.save();

    return res.status(200).json({
      message: "Documents uploaded successfully",
      provider,
    });
  } catch (err) {
    console.error("upload documents error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  createProvider,
  getProvider,
  updateProvider,
  getProviders,
  getOneProviderDetails,
  nearbySearchLocation,
  recommendedProviders,
  availabilityProvider,
  uploadProviderDocuments
};
