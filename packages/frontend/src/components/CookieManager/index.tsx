import React, { useState, useCallback } from "react";

import CookiePreferencesModal from "./CookiePreferencesModal";

export default function CookieManager() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = useCallback(() => setIsOpen(true), []);

  const handleCloseModal = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        className="bg-transparent p-0 appearance-none cursor-pointer inline-block text-base text-blue-500"
        onClick={handleOpenModal}
      >
        Cookie Preference Manager
      </button>
      {isOpen && (
        <CookiePreferencesModal isOpen={isOpen} onClose={handleCloseModal} />
      )}
    </>
  );
}
