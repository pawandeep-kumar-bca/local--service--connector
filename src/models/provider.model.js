const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    providerName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    documents: {
      aadharCard: {
        url: {
          type: String,
          required: true,
        },
        fileId: {
          type: String,
        },
      },
      certificate: {
        url: {
          type: String,
          required: true,
        },
        fileId: {
          type: String,
        },
      },
    },

    profileImage: {
      url: {
        type: String,
      },
      fileId: {
        type: String,
      },
    },

    verificationStatus: {
      type: String,
      enum: ["verified", "not verified"],
      default: "not verified",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReview: {
      type: Number,
      default: 0,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    // GEO LOCATION FIELD
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
  },
  { timestamps: true }
);

// GEO INDEX
providerSchema.index({ location: "2dsphere" });

const providerModel = mongoose.model("Provider", providerSchema);

module.exports = providerModel;