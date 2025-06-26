import React from "react";

function HomeNotAuthenticated() {
  return (
    <div className="min-h-screen bg-gray-100">
      <section className="hero bg-cover bg-center h-screen text-white flex flex-col justify-center items-center text-center bg-blue-800" style={{backgroundImage: "url('/car-inspection.jpg')"}}>
        <h2 className="text-5xl font-extrabold mb-4">Your Car, Our Priority</h2>
        <p className="text-xl mb-6">Get accurate and detailed inspections at the palm of your hand</p>
        <a href="#features" className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-xl">Explore Features</a>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Accurate Reports</h3>
              <p>Get detailed reports after each inspection, with high accuracy and clear information about the car's health.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Real-time Updates</h3>
              <p>Receive notifications and real-time updates as soon as your inspection is complete or if anything urgent is detected.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Easy-to-use Interface</h3>
              <p>Our app is designed with simplicity in mind. You don’t need to be a mechanic to understand the results.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-blue-800 text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-700 rounded-lg shadow-lg">
              <h3 className="text-3xl font-semibold mb-4">Basic Plan</h3>
              <p className="text-xl mb-4">$19.99/month</p>
              <ul className="space-y-4 text-left">
                <li>Up to 3 inspections</li>
                <li>Basic reports</li>
                <li>Email support</li>
              </ul>
              <button className="bg-white text-blue-700 py-2 px-6 mt-6 rounded-full">Start Now</button>
            </div>
            <div className="p-6 bg-blue-700 rounded-lg shadow-lg">
              <h3 className="text-3xl font-semibold mb-4">Premium Plan</h3>
              <p className="text-xl mb-4">$39.99/month</p>
              <ul className="space-y-4 text-left">
                <li>Unlimited inspections</li>
                <li>Advanced reports</li>
                <li>Priority support</li>
              </ul>
              <button className="bg-white text-blue-700 py-2 px-6 mt-6 rounded-full">Start Now</button>
            </div>
            <div className="p-6 bg-blue-700 rounded-lg shadow-lg">
              <h3 className="text-3xl font-semibold mb-4">Enterprise Plan</h3>
              <p className="text-xl mb-4">Contact us</p>
              <ul className="space-y-4 text-left">
                <li>Custom inspection features</li>
                <li>Dedicated support team</li>
                <li>Team management tools</li>
              </ul>
              <button className="bg-white text-blue-700 py-2 px-6 mt-6 rounded-full">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-gray-800 text-white py-8 text-center">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold mb-4">Contact Us</h3>
          <p>If you have any questions or want to know more, feel free to reach out!</p>
          <a href="mailto:support@carinspectionapp.com" className="text-blue-400 hover:text-blue-600 mt-4 block">support@carinspectionapp.com</a>
        </div>
      </footer>
    </div>
  );
}

export default HomeNotAuthenticated;
