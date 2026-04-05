async function testKey() {
  const key = "AIzaSyDCdYPlVLbDO55Iu-DmDCypHNUQOrQ6SQU"; // User provided this earlier
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    if (data.models) {
      console.log("AVAILABLE MODELS:");
      data.models.forEach(m => console.log("- " + m.name));
    } else {
      console.log("Error Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

testKey();
