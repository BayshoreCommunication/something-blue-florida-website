import Link from "next/link";

const NotFound = () => {
  return (
    <div className="text-center my-20 flex flex-col gap-4 justify-center items-center text-[#132841] main-container pt-20 md:pt-40">
      <h1 className="font-bold text-7xl lg:text-9xl text-[#132841]">
        Oops
      </h1>
      <p className="mt-5 font-bold text-lg">404 - PAGE NOT FOUND</p>
      <div>
        <p>The page you looking for might have been removed, or</p>
        <p>{`had it's name changed or is temporarily unavailable`}</p>
      </div>
      <Link href={"/"} className="btn-primary font-semibold px-6 py-3">
        GO TO HOMEPAGE
      </Link>
    </div>
  );
};

export default NotFound;
