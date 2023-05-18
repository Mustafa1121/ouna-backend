const vision = require("@google-cloud/vision");

async function performLabelDetection(imageURLs) {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "./ai.json",
  });

  try {
    const labelsArray = [];

    for (let i = 0; i < imageURLs.length; i++) {
      const imageURL = imageURLs[i];
      const base64Image = imageURL.replace(/^data:image\/jpeg;base64,/, "");
      const buffer = Buffer.from(base64Image, "base64");
      const [result] = await client.labelDetection(buffer);
      const labels = result.labelAnnotations;

      console.log(`Labels for image ${i + 1}:`);
      labels.forEach((label) => console.log(label.description));

      labelsArray.push(labels);
    }

    // Check if there is a common label among all the images
    const commonLabels = labelsArray.reduce(
      (common, labels) => {
        return common.filter((label) =>
          labels.some((l) => l.description === label)
        );
      },
      labelsArray[0].map((label) => label.description)
    );
    console.log(commonLabels);
    const hasCommonLabel = commonLabels.length > 0;
    console.log(hasCommonLabel);
    return hasCommonLabel;
  } catch (err) {
    console.error("ERROR:", err);
    return false;
  }
}

module.exports = { performLabelDetection };
