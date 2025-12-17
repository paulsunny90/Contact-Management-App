import Contact from "../models/contact.models.js";


export const creatContact = async (req, res) => {
  try {
    const { name, countrycode, phnumber } = req.body;
    const contact = await Contact.create({
      name,
      countrycode,
      phnumber
    });

    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const readContact = async (req, res) => {
  try {
    const read = await Contact.find().limit(20);
    res.json(read);
  } catch (err) {
    res.status(400).json({ message: "Not read" });
  }
};


export const updatContact = async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Not updated" });
  }
};


export const deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ message: "Not deleted" });
  }
};

