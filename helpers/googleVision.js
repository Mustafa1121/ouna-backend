const Category = require('../models/Category/CategoryModel')
const vision = require("@google-cloud/vision");

async function classifyImages(imageFiles) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename:
      process.env.upload_path + "/../../ai.json",
  });

  try {
    const categories = await Category.find();

    // Classify each image
    const classifications = [];
    for (const file of imageFiles) {
      const results = await client.labelDetection(
        process.env.upload_path + file
      );

      console.log("results", results[0].labelAnnotations);

      const labels = results[0].labelAnnotations.map(
        (label) => label.description
      );
      classifications.push(labels);
    }

    // Check if any classification includes electronics
    const hasElectronics = classifications.some((labels) =>
      labels.some((label) => label.toLowerCase().includes("electronics"))
    );

    return hasElectronics;
  } catch (e) {
    console.log("error of Google API: " + e);
    return false;
  }
}

// const hasElectronics = await classifyImages(imageFiles);
// console.log(hasElectronics); // true or false
