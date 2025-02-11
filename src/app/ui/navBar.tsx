export default function NavBar() {
  return (
    <div className="flex w-screen justify-center content-between place-items-center h-10 relative z-10 bg-slate-500 px-48">
      <p className="text-center text-nowrap">Nav Bar</p>
      <div className="flex w-screen justify-end content-end gap-2">
        <button className="px-4 py-1 bg-slate-800 rounded-xl">Log in</button>
        <button className="px-4 py-1 bg-slate-600 rounded-xl">Register</button>
      </div>
    </div>
  );
}
