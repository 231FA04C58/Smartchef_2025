const About = () => {
  return (
    <div className="container about-page">
      <h1>About SmartChef</h1>
      <p>SmartChef is a front-end demo of an Intelligent Recipe Finder and Meal Planner platform. It focuses on creating delightful user experiences with:</p>
      <ul>
        <li>Recipe search & discovery</li>
        <li>Personalized recommendations</li>
        <li>Interactive weekly meal planner with shopping list generation</li>
      </ul>

      <div className="team">
        <h3>Design highlights</h3>
        <p>Colorful gradients, large imagery, and friendly microcopy make the app approachable and cheery.</p>
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=800&fit=crop" 
          alt="A clean, modern kitchen"
        />
      </div>
    </div>
  )
}

export default About

