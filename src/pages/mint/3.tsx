import {
  useNetwork,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import Container from "~/components/Container";
import {
  PercentageField,
  DaysField,
  WalletAddressField,
} from "~/components/FormFields";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { clsx } from "clsx";
import * as yup from "yup";

const Mint = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);

  /*** CONTRACT READ SETUP  ***/

  const { data } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserMint",
    overrides: { from: address },
    cacheOnBlock: true,
    watch: true,
  });

  /*** FORM SETUP ***/

  // Claim

  const { handleSubmit: cHandleSubmit } = useForm();

  const { config: configClaim } = usePrepareContractWrite({
    ...xenContract(chain),
    functionName: "claimMintReward",
  });
  const { data: claimData, write: writeClaim } = useContractWrite({
    ...configClaim,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess(data) {
      router.push("/stake/1");
    },
  });
  const handleClaimSubmit = () => {
    writeClaim?.();
  };

  // Claim + Share
  const walletAddressesRegex = new RegExp(
    `^(0x[0-9a-fA-F]{40})(,0x[0-9a-fA-F]{40})*$`
  );

  const schemaClaimShare = yup
    .object()
    .shape({
      claimShareAddress: yup
        .string()
        .required("Crypto address required")
        .matches(walletAddressesRegex, {
          message: "Invalid address",
          excludeEmptyString: true,
        }),
      claimSharePercentage: yup
        .number()
        .required("Percentage required")
        .positive("Percentage must be greater than 0")
        .max(100, "Maximum claim + share percentage: 100")
        .typeError("Percentage required"),
    })
    .required();

  const {
    register: cShareRegister,
    handleSubmit: cShareHandleSubmit,
    watch: cShareWatch,
    formState: { errors: cShareErrors },
  } = useForm({
    resolver: yupResolver(schemaClaimShare),
  });
  const cShareWatchAllFields = cShareWatch();

  const { config: configClaimShare } = usePrepareContractWrite({
    ...xenContract(chain),
    functionName: "claimMintRewardAndShare",
    args: [
      cShareWatchAllFields.claimShareAddress,
      cShareWatchAllFields.claimSharePercentage,
    ],
  });
  const { data: claimShareData, write: writeClaimShare } = useContractWrite({
    ...configClaimShare,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: claimShareData?.hash,
    onSuccess(data) {
      router.push("/stake/1");
    },
  });
  const handleClaimShareSubmit = () => {
    writeClaimShare?.();
  };

  // Claim + Stake

  const schemaClaimStake = yup
    .object()
    .shape({
      claimStakePercentage: yup
        .number()
        .required("Percentage required")
        .positive("Percentage must be greater than 0")
        .max(100, "Maximum claim + stake percentage: 100")
        .typeError("Percentage required"),
      claimStakeDays: yup
        .number()
        .required("Days required")
        .positive("Days must be greater than 0")
        .typeError("Days required"),
    })
    .required();

  const {
    register: cStakeRegister,
    handleSubmit: cStakeHandleSubmit,
    watch: cStakeWatch,
    formState: { errors: cStakeErrors },
  } = useForm({
    resolver: yupResolver(schemaClaimStake),
  });
  const cStakeWatchAllFields = cStakeWatch();

  const { config: configClaimStake } = usePrepareContractWrite({
    ...xenContract(chain),
    functionName: "claimMintRewardAndStake",
    args: [
      cStakeWatchAllFields.claimStakePercentage,
      cStakeWatchAllFields.claimStakeDays,
    ],
  });
  const { data: claimStakeData, write: writeClaimStake } = useContractWrite({
    ...configClaimStake,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: claimStakeData?.hash,
    onSuccess(data) {
      router.push("/stake/2");
    },
  });

  const handleClaimStakeSubmit = () => {
    writeClaimStake?.();
  };

  /*** USE EFFECT ****/
  const utcTime = new Date().getTime() / 1000;

  useEffect(() => {
    if (
      address &&
      data &&
      !data.maturityTs.isZero() &&
      data.maturityTs < utcTime
    ) {
      if (!processing) {
        setDisabled(false);
      }
    }
  }, [address, data, processing, utcTime]);

  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/mint/1">
            <a className="step step-neutral">Start Mint</a>
          </Link>

          <Link href="/mint/2">
            <a className="step step-neutral">Minting</a>
          </Link>

          <Link href="/mint/3">
            <a className="step step-neutral">Claim</a>
          </Link>
        </ul>

        <div className="card glass">
          <div className="card-body">
            <div className="flex flex-col w-full border-opacity-50">
              <form onSubmit={cHandleSubmit(handleClaimSubmit)}>
                <div className="flex flex-col space-y-4">
                  <h2 className="card-title text-neutral">Claim</h2>
                  <button
                    type="submit"
                    className={clsx("btn glass text-neutral", {
                      loading: processing,
                    })}
                    disabled={disabled}
                  >
                    Claim
                  </button>
                </div>
              </form>
              {/* OR */}
              <div className="divider">OR</div>
              {/* OR */}
              <form onSubmit={cShareHandleSubmit(handleClaimShareSubmit)}>
                <div className="flex flex-col space-y-4">
                  <h2 className="card-title text-neutral">Claim + Share</h2>

                  <PercentageField
                    disabled={disabled}
                    errorMessage={
                      <ErrorMessage
                        errors={cShareErrors}
                        name="claimSharePercentage"
                      />
                    }
                    register={cShareRegister("claimSharePercentage")}
                  />

                  <WalletAddressField
                    disabled={disabled}
                    errorMessage={
                      <ErrorMessage
                        errors={cShareErrors}
                        name="claimShareAddress"
                      />
                    }
                    register={cShareRegister("claimShareAddress")}
                  />

                  <button
                    type="submit"
                    className={clsx("btn glass text-neutral", {
                      loading: processing,
                    })}
                    disabled={disabled}
                  >
                    Claim + Share
                  </button>
                </div>
              </form>
              {/* OR */}
              <div className="divider">OR</div>
              {/* OR */}
              <form onSubmit={cStakeHandleSubmit(handleClaimStakeSubmit)}>
                <div className="flex flex-col space-y-4">
                  <h2 className="card-title text-neutral">Claim + Stake</h2>
                  <PercentageField
                    disabled={disabled}
                    errorMessage={
                      <ErrorMessage
                        errors={cStakeErrors}
                        name="claimStakePercentage"
                      />
                    }
                    register={cStakeRegister("claimStakePercentage")}
                  />

                  <DaysField
                    disabled={disabled}
                    errorMessage={
                      <ErrorMessage
                        errors={cStakeErrors}
                        name="claimStakeDays"
                      />
                    }
                    register={cStakeRegister("claimStakeDays")}
                  />

                  <button
                    type="submit"
                    className={clsx("btn glass text-neutral", {
                      loading: processing,
                    })}
                    disabled={disabled}
                  >
                    Claim + Stake
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
