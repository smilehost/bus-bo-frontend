import TitlePage from "@/app/components/Title/TitlePage";
import React from "react";

function ManagePaymentMethodPage() {
  return (
    <>
      <TitlePage
        title={`Payment Method Management`}
        description="View and manage device"
        btnText="Add New Device"
      />
    </>
  );
}

export default ManagePaymentMethodPage;
