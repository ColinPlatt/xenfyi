export const AmountField = (props: any) => {
  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">AMOUNT</span>
        <span className="label-text-alt text-error">Required</span>
      </label>
      <input
        type="text"
        placeholder="0.0"
        className="input input-bordered w-full text-neutral"
        disabled={props.disabled}
        {...props.register}
      />
      <label className="label">
        <span className="label-text-alt text-neutral">
          The amount of XEN up to balance
        </span>
        <span className="label-text-alt text-neutral">
          Balance: {props.balance}
          <a
            onClick={() => props.setValue("startStakeAmount", props.balance)}
            className="btn btn-xs glass text-neutral ml-2"
          >
            MAX
          </a>
        </span>
      </label>
    </div>
  );
};

export const DaysField = (props: any) => {
  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">DAYS</span>
        <span className="label-text-alt text-error">Required</span>
      </label>
      <input
        type="text"
        placeholder="0"
        className="input input-bordered w-full text-neutral"
        disabled={props.disabled}
        {...props.register}
      />
      <label className="label">
        <span className="label-text-alt text-neutral">
          Select the number of days between 1 and 1000
        </span>
      </label>
    </div>
  );
};

export const PercentageField = (props: any) => {
  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">SHARE PERCENTAGE</span>
        <span className="label-text-alt text-error">Required</span>
      </label>
      <input
        type="text"
        placeholder="1% — 100%"
        className="input input-bordered w-full text-neutral"
        disabled={props.disabled}
        {...props.register}
      />
      <label className="label">
        <span className="label-text-alt text-neutral">
          The percentage of XEN between 1% and 100%
        </span>
      </label>
    </div>
  );
};
