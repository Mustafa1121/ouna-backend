const vision = require("@google-cloud/vision");

async function performLabelDetection(imageURLs) {
  const client = new vision.ImageAnnotatorClient({
    credentials: {
      type: "service_account",
      project_id: "master-tuner-371310",
      private_key_id: "4c41ba52a0c059842d90ca45bbabba58865043ab",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDCCXosYeMK5X6l\nK1vW+onhN8CIMAjPoCmyudbgbDP8DaSQQdXoTb0SaAki/5Xljh6/NMWUqw4AiJ+0\n6luI4ZZEs7XipLRLGwcH49CCk09v7IJNQuqRu/x5VZD/BqX1aUJdgMUW1cGvogi2\n+uvOz18aFx3EcxClPhcmTn+YTIFUqfv2kDKv1fQmvFm5JKrNUw19cX1wxzGs4Vo2\nflSK4JXL8FDHOC/wA53P5pSiUWO8ndAJ4wRps0t0l3AR5DaOuz9HwUBMHTNEWNEz\npzh024WeRFqgJ5CA2kIGJo6P6jbA6iRvzZHznz9E4RaEYq56OtFNQjWsEeR1bKa6\nAwT2lz53AgMBAAECggEAJta6y7N0PLQfG3SIV4mim6ALO7dRrC2E6y9joVxHM4aP\nkAh9hpg45jxIx+ac3GwMH32ypsVuchDm1tGqLMXqzCmkmI8bP4VTbPLew6Q03FRc\n6JYiWbVlHexQr5tnEK5XCFxEFwQGVt96GxYyqRy9Dn3eCXp2tHyvKY3A4H0/zfA2\n+6GMVdbu10MAvhA0LJeEDms2sUTtDRb/5dsFu6ykE50+X+A9rF8ZHByzIOfAO3PQ\n9wFtmwBZKJNS+J+Bw5h6l752Hx0vaOC7U92p/qn/eLN3nmy7NlFafBvK6hkssxVp\nB3jNnOL3lGqLCRxnasa8rs6CN3g6oWXZE6/tXfTrMQKBgQDvC2hhagd2F9lApTMS\noVe65KFY+pct8H6kmH5SCEZ3w9Ado0d+OihgivRcLl4CNS7hA/P8TZhgkil6GKCf\n83nlnjCymNBEk0TB0SNXc7URd6TcBFpLkmH+hFLHhPlCLJoMHCAfEyKDPcIoMsq6\nYsXk1pbe9fPIuyXQK1UACoapKwKBgQDPzNGPoraNtJzr3Cahy/kf0dnC4FuG9KCX\noAz51PLgjdFl0ab5g6X5GUZifw6kF2BUBIVdV/qE61GsNRaUKkH4lu0207+N5S5c\nzzH++TArbHgRU2TKyP1XbFDth15DiF4Q0NniFJTYnCzgHlGSTC8H6Sk7ChAsKqy8\nsHXffopB5QKBgBSWGusownO9IgybLYbRNkj2H58WFabzKzTpnRdbdxYhWu7yfNm2\nEHwf+2Nk6tut0Ne4C28TD6hhbgkBzfN4eGr58J+w4V7GgAlhBXYmlNVoRF5eUZho\nht/wbWCZZw334Vxhn7KNZ09+JhZoKWVb1Ecc4+lXrSMAWwVOdgeG4In5AoGBAKW/\nJ0A8dwQcljYDScUwXyukRN+N+TNyGE4Y2YDE/F1kgSuHyHmpKk/Ae0XBNrpn8uvR\nF1dW/3naATEsvy+7bReNuvRKfbX+obZhhe1scaGRSUv4iqK9ImYC/aIYoXWYZf9f\ntwr/g6IrIBg71rCsl67lqX9wDWpNN67hyYNU+Y6JAoGBAOrJ5CNeDYRzAeP+clPk\nnzgeVnzFIS22PXCWt64UVQoCEODJQvsRZuURwnQGm5ZGRIHVVBLCG+1kOvGscaqF\nIGz1z0C1AJPWD6nZheEXdORDdMnm7Ds9dnH18+lyv7WLL8fDZl0WkxkC/xSofX45\nypKSoMlySoTzYQ8DBJhZK+Bq\n-----END PRIVATE KEY-----\n",
      client_email: "google-vision@master-tuner-371310.iam.gserviceaccount.com",
      client_id: "103549906113238882599",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/google-vision%40master-tuner-371310.iam.gserviceaccount.com",
    },
  });

  try {
    const labelsArray = [];
    console.log(imageURLs);
    for (let i = 0; i < imageURLs.length; i++) {
      const imageURL = imageURLs[i];
      const base64Image = imageURL.replace(/^data:image\/jpeg;base64,/, "");
      const buffer = Buffer.from(base64Image, "base64");
      const [result] = await client.labelDetection(buffer);
      const labels = result.labelAnnotations;

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
    const hasCommonLabel = commonLabels.length > 0;
    return hasCommonLabel;
  } catch (err) {
    console.error("ERROR:", err);
    return false;
  }
}

module.exports = { performLabelDetection };
