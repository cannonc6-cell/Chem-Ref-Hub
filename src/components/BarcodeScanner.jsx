import React, { useEffect, useRef, useState } from 'react';

/**
 * Simple barcode scanner using the native MediaDevices.getUserMedia API.
 * It shows the camera feed and lets the user type in or paste the scanned
 * code manually, so you can later replace this with an auto-decoding
 * library if desired.
 */
function BarcodeScanner({ onDetected, onClose }) {
	const videoRef = useRef(null);
	const streamRef = useRef(null);
	const [manualCode, setManualCode] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		let cancelled = false;

		const startCamera = async () => {
			try {
				const constraints = {
					video: {
						facingMode: 'environment',
					},
					audio: false,
				};
				const stream = await navigator.mediaDevices.getUserMedia(constraints);
				if (cancelled) return;
				streamRef.current = stream;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.play().catch(() => {});
				}
			} catch (err) {
				console.error('Camera error', err);
				setError('Unable to access camera. Check permissions.');
			}
		};

		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			startCamera();
		} else {
			setError('Camera not supported in this browser.');
		}

		return () => {
			cancelled = true;
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((t) => t.stop());
			}
		};
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!manualCode.trim()) return;
		onDetected(manualCode.trim());
	};

	return (
		<div className="modal-backdrop show" style={{ zIndex: 1050 }}>
			<div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
				<div className="modal-dialog modal-lg modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Scan Barcode</h5>
							<button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
						</div>
						<div className="modal-body">
							{error && (
								<div className="alert alert-danger" role="alert">
									{error}
								</div>
							)}
							<div className="mb-3">
								<video
									ref={videoRef}
									style={{ width: '100%', borderRadius: '8px', background: '#000' }}
									muted
								></video>
							</div>
							<p className="small text-muted mb-2">
								Point your camera at the barcode. If automatic detection is not yet configured, you can type or paste the code below.
							</p>
							<form onSubmit={handleSubmit} className="d-flex gap-2">
								<input
									type="text"
									className="form-control"
									placeholder="Enter or paste scanned code (e.g. CAS #, ID)"
									value={manualCode}
									onChange={(e) => setManualCode(e.target.value)}
								/>
								<button type="submit" className="btn btn-primary">
									Use Code
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BarcodeScanner;
