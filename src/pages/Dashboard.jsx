import { Link } from 'react-router-dom';

export default function Dashboard() {

  return(

    <div>
    <div className = "min-h-screen flex flex-col bg-white justify-center items-center">
      <h1 className = "text-6xl  text-black">
        Task
        <span className="text-cyan-500"> 
          Board
        </span>
      </h1>

    <hr className="m-4 border-black w-70"  />


    <p className="text-lg">
      Less chaos, more progress
    </p>
    </div>

    <nav className="flex justify-centre gap-4 fixed top-0 right-0 m-4 text-base ">
      <Link to="/Login" className=" text-black bg-gradient-to-r from-black to-black bg-no-repeat bg-bottom bg-[length:0%_1px] hover:bg-[length:100%_1px] transition-all duration-500 pb-2">
      Log in
      </Link>

     <Link to="/Register" className=" text-black bg-gradient-to-r from-black to-black bg-no-repeat bg-bottom bg-[length:0%_1px] hover:bg-[length:100%_1px] transition-all duration-500 pb-2">
      Sign up
      </Link>

    </nav>


    <div className="fixed top-0 left-0 w-50 h-50 bg-cyan-500"></div>
    <div className="fixed -bottom-38 -right-38 w-78 h-78 bg-cyan-500 rounded-full"></div>

</div>
  ); 

}
