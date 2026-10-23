function QuantityStepper({ qty, onDecrease, onIncrease }) {
  return (
    <div className="stepper">
      <button type="button" onClick={onDecrease} aria-label="Decrease quantity">
        −
      </button>
      <span>{qty}</span>
      <button type="button" onClick={onIncrease} aria-label="Increase quantity">
        +
      </button>
    </div>
  )
}

export default QuantityStepper
