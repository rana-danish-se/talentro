import Service from "../models/Service.model.js";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      userId: req.user.id,
    };

    const newService = new Service(serviceData);
    await newService.save();
    res.status(201).json({ success: true, data: newService });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
