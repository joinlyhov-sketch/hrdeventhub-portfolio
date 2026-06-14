"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X, User, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { connectBankCredentialAction } from "@/actions/payment.action";

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectBankModal({
  isOpen,
  onClose,
}: ConnectBankModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showAccountNo, setShowAccountNo] = useState(false);

  const [formData, setFormData] = useState({
    accountName: "",
    accountNo: "",
    clientId: "",
    clientSecret: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleResetAndClose = () => {
    if (isPending) return;
    setFormData({
      accountName: "",
      accountNo: "",
      clientId: "",
      clientSecret: "",
    });
    setFormErrors({});
    setServerError(null);
    setShowConfirmation(false);
    onClose();
  };

  const validateForm = () => {
    const errors: Partial<typeof formData> = {};
    if (!formData.accountName.trim())
      errors.accountName = "Account name is required";
    if (!formData.accountNo.trim())
      errors.accountNo = "Account number is required";
    if (!formData.clientId.trim())
      errors.clientId = "Client ID credential is required";
    if (!formData.clientSecret.trim())
      errors.clientSecret = "Client secret credential is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setServerError(null);
    setShowConfirmation(true);
  };

  const handleConfirmDisconnect = () => {
    startTransition(async () => {
      const result = await connectBankCredentialAction(formData);

      if (!result.ok) {
        setServerError(
          result.error || "Failed to process bank link credentials.",
        );
        setShowConfirmation(false);
        return;
      }

      handleResetAndClose();
      router.push(pathname);
      router.refresh();
    });
  };

  const handleCancelAndNavigate = () => {
    handleResetAndClose();
    router.push(pathname);
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && handleResetAndClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content
          onPointerDownOutside={(e) => isPending && e.preventDefault()}
          onInteractOutside={(e) => isPending && e.preventDefault()}
          onEscapeKeyDown={(e) => isPending && e.preventDefault()}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] bg-white rounded-[24px] shadow-2xl z-50 overflow-hidden outline-none flex flex-col p-12"
        >
          <button
            disabled={isPending}
            onClick={handleResetAndClose}
            className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={24} strokeWidth={1.5} />
          </button>

          <div className="flex flex-col justify-between grow mt-2">
            <AnimatePresence mode="wait">
              {!showConfirmation ? (
                <motion.form
                  key="form-view"
                  onSubmit={handleProceedToConfirm}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5 grow flex flex-col justify-center"
                >
                  <Dialog.Title>
                    <div className="mb-8">
                      <Image
                        src="/images/WeBill.png"
                        alt="WeBill365"
                        width={120}
                        height={32}
                        className="h-8 mb-4 object-contain"
                      />
                      <p className="type-desc text-gray-500">
                        Enter the correct info below to change WeBill365 account
                      </p>
                    </div>
                  </Dialog.Title>

                  <div className="flex flex-col gap-2">
                    <label className="type-subtitle text-secondary">
                      Account Name
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl bg-[#f8f9fc] px-4 py-3.5 transition-all border ${formErrors.accountName ? "border-red-400" : "border-transparent focus-within:border-gray-500"}`}
                    >
                      <User
                        size={18}
                        className="type-desc text-gray-300"
                        strokeWidth={2}
                      />
                      <input
                        placeholder="Developer GenZ"
                        type="text"
                        value={formData.accountName}
                        disabled={isPending}
                        onChange={(e) =>
                          handleInputChange("accountName", e.target.value)
                        }
                        className="w-full bg-transparent type-desc outline-none text-gray-700 placeholder:text-gray-500"
                      />
                    </div>
                    {formErrors.accountName && (
                      <p className="type-desc text-red-500">
                        {formErrors.accountName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="type-subtitle text-secondary">
                      Account No.
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl bg-[#f8f9fc] px-4 py-3.5 transition-all border ${formErrors.accountNo ? "border-red-400" : "border-transparent focus-within:border-gray-500"}`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.78269 14.7885H14.716C14.641 14.8552 14.566 14.9136 14.491 14.9802L10.9327 17.6469C9.75768 18.5219 7.84102 18.5219 6.65769 17.6469L3.09102 14.9802C2.30769 14.3969 1.66602 13.1052 1.66602 12.1302V5.9552C1.66602 4.93854 2.44102 3.81354 3.39102 3.4552L7.54102 1.89687C8.22435 1.63854 9.35768 1.63854 10.041 1.89687L14.1827 3.4552C14.9744 3.7552 15.6493 4.58854 15.8577 5.43854H9.77435C9.59101 5.43854 9.42434 5.44688 9.26601 5.44688C7.72434 5.53855 7.32434 6.09687 7.32434 7.8552V12.3802C7.33268 14.2969 7.82435 14.7885 9.78269 14.7885Z"
                          stroke="#BCC5CD"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.33203 9.34375H18.332"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.332 7.84688V12.4719C18.3154 14.3219 17.807 14.7802 15.882 14.7802H9.78203C7.8237 14.7802 7.33203 14.2885 7.33203 12.3635V7.83854C7.33203 6.08854 7.73203 5.53019 9.2737 5.43019C9.43203 5.43019 9.5987 5.42188 9.78203 5.42188H15.882C17.8404 5.43021 18.332 5.91354 18.332 7.84688Z"
                          stroke="#BCC5CD"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.43359 12.7109H10.5419"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.291 12.7109H15.016"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <input
                        placeholder="1120000811230"
                        type={showAccountNo ? "text" : "password"}
                        value={formData.accountNo}
                        disabled={isPending}
                        onChange={(e) =>
                          handleInputChange("accountNo", e.target.value)
                        }
                        className="w-full bg-transparent text-desc outline-none text-gray-700 placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccountNo(!showAccountNo)}
                        className="text-gray-300 hover:text-gray-500"
                      >
                        {showAccountNo ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    {formErrors.accountNo && (
                      <p className="text-desc text-red-500">
                        {formErrors.accountNo}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="type-subtitle text-secondary">
                      Client ID
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl bg-[#f8f9fc] px-4 py-3.5 transition-all border ${formErrors.clientId ? "border-red-400" : "border-transparent focus-within:border-gray-500"}`}
                    >
                      <LockKeyhole
                        size={18}
                        className="text-gray-400"
                        strokeWidth={2}
                      />
                      <input
                        placeholder="2bf667d0112d5817feb17b2090b84e24"
                        type="text"
                        value={formData.clientId}
                        disabled={isPending}
                        onChange={(e) =>
                          handleInputChange("clientId", e.target.value)
                        }
                        className="w-full bg-transparent type-desc outline-none text-gray-700 placeholder:text-gray-500"
                      />
                    </div>
                    {formErrors.clientId && (
                      <p className="type-desc text-red-500">
                        {formErrors.clientId}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="type-subtitle text-secondary">
                      Client Secret
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-xl bg-[#f8f9fc] px-4 py-3.5 transition-all border ${formErrors.clientSecret ? "border-red-400" : "border-transparent focus-within:border-gray-500"}`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.4912 12.4406C14.7746 14.149 12.3162 14.674 10.1579 13.999L6.23289 17.9156C5.94955 18.2073 5.39122 18.3823 4.99122 18.324L3.17455 18.074C2.57455 17.9906 2.01622 17.424 1.92455 16.824L1.67455 15.0073C1.61622 14.6073 1.80789 14.049 2.08289 13.7656L5.99955 9.84896C5.33289 7.68229 5.84955 5.22396 7.56622 3.51563C10.0246 1.05729 14.0162 1.05729 16.4829 3.51563C18.9496 5.97396 18.9496 9.98229 16.4912 12.4406Z"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.74219 14.5781L7.65885 16.4948"
                          stroke="#BCC5CD"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.084 9.16406C12.7743 9.16406 13.334 8.60442 13.334 7.91406C13.334 7.22371 12.7743 6.66406 12.084 6.66406C11.3936 6.66406 10.834 7.22371 10.834 7.91406C10.834 8.60442 11.3936 9.16406 12.084 9.16406Z"
                          stroke="#BCC5CD"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        placeholder="........................"
                        type={showClientSecret ? "text" : "password"}
                        value={formData.clientSecret}
                        disabled={isPending}
                        onChange={(e) =>
                          handleInputChange("clientSecret", e.target.value)
                        }
                        className="flex-1 min-w-0 bg-transparent text-desc outline-none text-gray-700 placeholder:text-gray-500 tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowClientSecret(!showClientSecret)}
                        className="text-gray-300 hover:text-gray-500"
                      >
                        {showClientSecret ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    {formErrors.clientSecret && (
                      <p className="text-desc text-red-500">
                        {formErrors.clientSecret}
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-red-600">
                      {serverError}
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-2 h-[52px] rounded-[14px] bg-[#FAA228] text-white hover:bg-[#F2941E]"
                    >
                      Disconnect
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="disconnect-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-start text-left w-full px-2 pt-2 pb-1"
                >
                  <div className="space-y-2.5 w-full">
                    <h3 className="type-title text-secondary tracking-tight font-bold text-xl">
                      Disconnect
                    </h3>
                    <p className="type-desc text-gray-500">
                      Are you sure you want to disconnect your WeBill365
                      account?
                    </p>
                  </div>

                  {serverError && (
                    <div className="w-full mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-red-600">
                      {serverError}
                    </div>
                  )}

                  <div className="flex items-center gap-4 w-full mt-8">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleConfirmDisconnect}
                      className="flex-1 h-14 text-white bg-primary hover:bg-primary type-desc rounded-[16px] transition-all flex items-center justify-center"
                    >
                      {isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        "Yes"
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleCancelAndNavigate}
                      className="flex-1 h-14 bg-white border border-[#ef4444] hover:bg-red-50/40 text-[#ef4444] type-desc rounded-[16px] transition-all flex items-center justify-center cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
