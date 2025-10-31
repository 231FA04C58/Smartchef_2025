import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

const Home = () => {
  const { currentUser } = useAuth()
  const [heroRef, heroVisible] = useScrollReveal({ threshold: 0.2 })
  const [featuresRef, featuresVisible] = useScrollReveal({ threshold: 0.1 })
  const [ctaRef, ctaVisible] = useScrollReveal({ threshold: 0.2 })

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`hero-section ${heroVisible ? 'visible' : ''}`}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">SmartChef</span>
          </h1>
          <p className="hero-subtitle">
            Discover delicious recipes, plan your meals, and transform your cooking experience
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              <i className="fas fa-rocket"></i> Get Started
            </Link>
            <Link to="/recipes" className="btn btn-outline btn-lg">
              <i className="fas fa-search"></i> Browse Recipes
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <i className="fas fa-utensils"></i>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className={`features-section ${featuresVisible ? 'visible' : ''}`}
      >
        <div className="container">
          <div className="section-header">
            <h2>Why Choose SmartChef?</h2>
            <p>Everything you need to create amazing meals, all in one place</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>Discover Recipes</h3>
              <p>Explore thousands of recipes from around the world. From quick meals to gourmet dishes, find the perfect recipe for any occasion.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Meal Planning</h3>
              <p>Plan your weekly meals effortlessly. Organize breakfast, lunch, and dinner with our intuitive meal planner.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h3>Shopping Lists</h3>
              <p>Automatically generate shopping lists from your meal plans. Never forget an ingredient again!</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h3>AI Recipe Generator</h3>
              <p>Create custom recipes with AI assistance. Tell us what you have, and we'll suggest amazing dishes.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Save Favorites</h3>
              <p>Save your favorite recipes and organize them into collections. Build your personal recipe library.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-pie"></i>
              </div>
              <h3>Nutrition Info</h3>
              <p>Get detailed nutritional information for every recipe. Track calories, protein, carbs, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in three simple steps</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up</h3>
                <p>Create your free account in seconds. No credit card required.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Explore Recipes</h3>
                <p>Browse our extensive collection of recipes or create your own.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Start Cooking</h3>
                <p>Plan your meals, generate shopping lists, and start cooking delicious food!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">1000+</div>
              <div className="stat-label">Recipes</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">50+</div>
              <div className="stat-label">Cuisines</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10000+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">5000+</div>
              <div className="stat-label">Meal Plans</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className={`cta-section ${ctaVisible ? 'visible' : ''}`}
      >
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Cooking?</h2>
            <p>Join thousands of users who are already creating amazing meals with SmartChef</p>
            <div className="cta-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                <i className="fas fa-user-plus"></i> Create Free Account
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg">
                <i className="fas fa-info-circle"></i> Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
