export default function VerifyRequestPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Check your email</h2>
          <p className="mb-4">
            A sign in link has been sent to your email address. Please check
            your inbox and spam folder.
          </p>
          <a href="/" className="btn btn-primary">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
