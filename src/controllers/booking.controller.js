// const userModel = require("../models/User.model");
const bookingsModel = require("../models/booking.model");
const providerModel = require("../models/provider.model");
const categoryModel = require("../models/category.model");
async function userBookingCreate(req, res) {
  try {
    const {
      providerId,
      serviceId,
      bookingDate,
      bookingSlot,
      serviceAddress: { city, pinCode, village },
    } = req.body;
    const userId = req.user.id;
    const provider = await providerModel.findById(providerId);

    if (!provider) {
      return res.status(404).json({ message: "provider not found" });
    }
    const price = provider.price;
    const serviceIdExist = await categoryModel.findOne({ _id: serviceId });

    if (!serviceIdExist) {
      return res.status(400).json({ message: "service is not exist" });
    }
    // current date (today start time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // user booking date
    const userDate = new Date(bookingDate);

    if (userDate < today) {
      return res.status(400).json({ message: "Invalid booking date" });
    }
    const bookingSlotAlready = await bookingsModel.findOne({
      providerId,
      bookingDate,
      bookingStatus: { $ne: "Cancelled" },
      bookingSlot: bookingSlot,
    });
    if (bookingSlotAlready) {
      return res.status(409).json({ message: "booking slot already booked" });
    }

    const alreadyBooking = await bookingsModel.findOne({
      providerId,
      userId,
      bookingDate,
      bookingSlot,
    });

    if (alreadyBooking) {
      return res
        .status(200)
        .json(
          { message: "user already booking this slot this provider" },
          alreadyBooking,
        );
    }
    const booking = await bookingsModel.create({
      providerId,
      serviceId,
      userId,
      bookingDate,
      bookingSlot,
      serviceAddress: { city, pinCode, village },
      price,
    });
    return res.status(201).json({
      message: "booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  userBookingCreate,
};
