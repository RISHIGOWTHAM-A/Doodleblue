function Stars({ rate }) {
  return (
    <span className="stars" aria-label={`Rated ${rate} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rate) ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </span>
  )
}

export default Stars
