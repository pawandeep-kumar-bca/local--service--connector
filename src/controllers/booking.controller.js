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

async function getUserAllBooking(req, res) {
  try {
    const userId = req.user.id;

    const allBookings = await bookingsModel
      .find({ userId })
      .populate(
        "providerId",
        "providerName phoneNumber price city profileImage status rating totalReview availability",
      );
    if (allBookings.length === 0) {
      return res
        .status(200)
        .json({ message: "user bookings not found", allBookings: [] });
    }
    return res
      .status(200)
      .json({ message: "user bookings fetch successfully", allBookings });
  } catch (err) {
    console.error("Get all user booking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
async function getUserOneBooking(req, res) {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const booking = await bookingsModel
      .findById(bookingId)
      .populate(
        "providerId",
        "providerName phoneNumber price city profileImage status rating totalReview availability",
      )
      .populate("serviceId", "name")
      .lean();
    if (!booking) {
      return res.status(404).json({ message: "booking not found" });
    }
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    return res
      .status(200)
      .json({ message: "user booking fetch successfully", booking });
  } catch (err) {
    console.error("user get one booking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function providerAcceptBooking(req, res) {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const provider = await providerModel.findOne({
      userId: userId
    });
    if(!provider){
        return res.status(404).json({message:'Provider not found'})
    }
    const providerId = provider._id;
   
    const booking = await bookingsModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.providerId.toString() !== providerId.toString()) {
      return res.status(403).json({ message: "forbidden" });
    }
    if (booking.bookingStatus !== "Pending") {
      return res.status(400).json({ message: "Invalid booking status" });
    }
    const bookingSlotAlready = await bookingsModel.findOne({
      providerId,
      bookingSlot: booking.bookingSlot,
      bookingDate: booking.bookingDate,
      bookingStatus:  "Accepted" ,
      _id:{$ne:bookingId}
    });
    if (bookingSlotAlready) {
      return res.status(409).json({ message: "Booking slot already booked" });
    }
    booking.bookingStatus = "Accepted";
    await booking.save();

    return res
      .status(200)
      .json({ message: "Booking accepted successfully", booking });
  } catch (err) {
    console.error("booking accepted error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
async function providerRejectBooking(req, res) {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const provider = await providerModel.findOne({
      userId: userId
    });
    if(!provider){
        return res.status(404).json({message:'Provider not found'})
    }
    const providerId = provider._id;
   
    const booking = await bookingsModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.providerId.toString() !== providerId.toString()) {
      return res.status(403).json({ message: "forbidden" });
    }
    if (booking.bookingStatus !== "Pending") {
      return res.status(400).json({ message: "Invalid booking status" });
    }
    booking.bookingStatus = "Reject";
    await booking.save();

    return res
      .status(200)
      .json({ message: "Booking Reject successfully", booking });
  } catch (err) {
    console.error("booking Reject error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function providerStartBooking(req,res) {
    try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const provider = await providerModel.findOne({
      userId: userId
    });
    if(!provider){
        return res.status(404).json({message:'Provider not found'})
    }
    const providerId = provider._id;
   
    const booking = await bookingsModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.providerId.toString() !== providerId.toString()) {
      return res.status(403).json({ message: "forbidden" });
    }
    if (booking.bookingStatus !== "Accepted") {
      return res.status(400).json({ message: "Invalid booking status" });
    }
    const currentDate = new Date(booking.bookingDate)
    if( currentDate !== Date.now()){
        return res.status(400).json({message:'Booking date is not today',
            booking.bookingStatus:'Reject'
        })
    }
    
    booking.bookingStatus = "Accepted";
    await booking.save();

    return res
      .status(200)
      .json({ message: "Booking start successfully", booking });
  } catch (err) {
    console.error("booking start error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {
  userBookingCreate,
  getUserAllBooking,
  getUserOneBooking,
  providerAcceptBooking,
  providerRejectBooking,
  providerStartBooking
};
