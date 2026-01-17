import UserinfoForm from "../components/UserinfoForm"

const Home = () => {

    return (
        <div className="home">
            <div className="logo-container">
                <h1>Welcome to the LoL Analyzer</h1>
                <p>Analyze your League of Legends matches and improve your gameplay!</p>
            </div>
            <UserinfoForm />
        </div>
    )
}

export default Home;