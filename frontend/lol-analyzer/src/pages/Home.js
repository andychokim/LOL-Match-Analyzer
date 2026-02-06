import UserinfoForm from "../components/UserinfoForm"

const HomePage = () => {

    return (
        <div className="home">
            <div className="logo-container">
                <h1>League of Legends Match Analyzer</h1>
                <p>Powered with llama-3.1</p>
            </div>
            <UserinfoForm />
        </div>
    )
}

export default HomePage;