const Category = require("../models/Category/CategoryModel");
const vision = require("@google-cloud/vision");

async function detect(image) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "../ai.json",
  });

  try {
    // Get all categories from the database
    const categories = await Category.find({});
    console.log(categories);

    // Classify the image
    const results = await client.annotateImage({
      image: {
        content: Buffer.from(image, "base64"),
      },
      features: [{ type: "LABEL_DETECTION" }],
    });
    const labels = results[0].labelAnnotations.map(
      (label) => label.description
    );

    // Check if any category is included in the labels
    const resultArray = [];
    categories.forEach((element) => {
      if (labels.includes(element.name)) {
        resultArray.push(element._id);
      }
    });

    // If a category is found
    if (resultArray.length > 0) {
      resultArray.push(labels.join(","));
      return resultArray;
    }

    return "Category did not match any classification!";
  } catch (e) {
    console.log("error of Google API: " + e);
    return "";
  }
}

module.exports = detect;
