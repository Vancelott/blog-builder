"use client";

import { useSession } from "next-auth/react";
import { useActionState, useState } from "react";
import { updateUser } from "@/app/lib/data";

export function FirstSignInForm() {
  const [hideModal, setHideModal] = useState(false);
  const { session } = useSession();
  const initialState = {
    name: "",
  };

  const [state, handleUpdate] = useActionState(updateUser, initialState);

  // TODO change to strictly equal, and also make it visible
  if (session?.id != 1 && !hideModal) {
    return (
      <>
        <div className="flex items-center justify-center h-screen w-full absolute bg-slate-800 bg-opacity-70 z-20">
          <div className="">
            <button
              onClick={() => setHideModal(true)}
              className="flex justify-end"
            >
              X
            </button>
            <form
              action={handleUpdate}
              className="flex flex-col gap-8 p-40 rounded-xl bg-teal-950"
            >
              <input name="name" placeholder="Username.." />
              {/*button for profile pic upload*/}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </>
    );
  }
}
