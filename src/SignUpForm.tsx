import React, { useState, useRef } from "react";
import "./SignUpForm.css"; // Assuming style.css is in the same folder

export const SignupForm: React.FC<{onSignupComplete: () => void}> = ({ onSignupComplete }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [qrCode, setQrCode] = useState<string>("");
  const [signup, setSignup] = useState(false)

  // Handle form submission
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (formRef.current) {
      const form = new FormData(formRef.current);
      const formData: { [key: string]: any } = {};
      form.forEach((value, key) => {
        formData[key] = value;
      });
      console.log(JSON.stringify(formData));

      const submitForm = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          const data = await response.json();
          console.log(data);
          setQrCode(data.qrcode);
          // need to pop up the QR code and then have a button that moves them to the next page
        } catch (error) {
          console.error("Error", error);
        }
      };

      submitForm();
    } else {
      console.error("Invalid form submission");
    }
  };

  const handleSignup = () => {
    setSignup(true)
    onSignupComplete()
  }

  return (
    <>
      {qrCode ? (
        <div className="qr">
          <h2>Take a picture of your QR code, it'll be used to access your account!</h2>
          <img src={qrCode} alt={qrCode} />
          <button onClick={handleSignup}>I've saved my QR code!</button>
        </div>
      ) : (
        <div className="container">
          <h2 style={{textAlign: "center"}}>Sign up for an account at Tan's Grocery Store!</h2>
          <form id="signupForm" ref={formRef} onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />

            {/* Quantitative Measures */}
            <fieldset>
              <legend>Quantitative Measures:</legend>
              <label htmlFor="priceConsciousness">
                1. How important is low price and discounted products for you?:
              </label>
              <input
                type="range"
                id="priceConsciousness"
                name="priceConsciousness"
                min="1"
                max="5"
              />

              <label htmlFor="brandLoyalty">
                2. How important is brand loyalty to you?:
              </label>
              <input
                type="range"
                id="brandLoyalty"
                name="brandLoyalty"
                min="1"
                max="5"
              />

              <label htmlFor="helpAppreciation">
                3. How much help do you need while shopping in terms of
                recommendations and product information?:
              </label>
              <input
                type="range"
                id="helpAppreciation"
                name="helpAppreciation"
                min="1"
                max="5"
              />

              <label htmlFor="degreeKnowledge">
                4. How aware are you about the different products available at
                the supermarket?:
              </label>
              <input
                type="range"
                id="degreeKnowledge"
                name="degreeKnowledge"
                min="1"
                max="5"
              />

              <label htmlFor="speedShopping">
                5. On a scale of 1-5 where 1 stands for slow informed decisions
                and 5 for quick recommendations, what kind of shopping
                experience would you prefer?:
              </label>
              <input
                type="range"
                id="speedShopping"
                name="speedShopping"
                min="1"
                max="5"
              />

              <label htmlFor="newExplore">
                6. How likely are you to try out new offerings and products?:
              </label>
              <input
                type="range"
                id="newExplore"
                name="newExplore"
                min="1"
                max="5"
              />
            </fieldset>

            {/* Qualitative Option Selection */}
            <fieldset>
              <legend>Qualitative Option Selection:</legend>

              <label htmlFor="dietaryPreferences">
                7. Dietary Preferences:
              </label>
              <textarea
                id="dietaryPreferences"
                name="dietaryPreferences"
              ></textarea>

              <label htmlFor="productInterest">
                8. Specialised Product Interest:
              </label>
              <textarea id="productInterest" name="productInterest"></textarea>
            </fieldset>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
};
