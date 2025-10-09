import { useState, useEffect } from 'react';

function App() {
  const [manifests, setManifests] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/firmware/manifests.json')
      .then(response => response.json())
      .then(data => {
        // Update paths to absolute URLs
        const updatedData = data.map((manifest: any) => ({
          ...manifest,
          builds: manifest.builds.map((build: any) => ({
            ...build,
            parts: build.parts.map((part: any) => ({
              ...part,
              path: window.location.origin + part.path
            }))
          }))
        }));
        setManifests(updatedData);
        if (updatedData.length > 0) {
          setSelectedIndex(0);
        }
      })
      .catch(error => console.error('Error loading manifests:', error));
  }, []);

  const selectedManifest = selectedIndex !== null ? manifests[selectedIndex] : null;

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-primary text-white p-3">
        <h1 className="h3 mb-0">Borneo-IoT OSS Web Flasher</h1>
      </header>
      <main className="flex-grow-1 p-3">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p>Welcome to the Borneo-IoT open-source firmware flashing tool! Please connect a compatible device to this computer, select your device model, and click Connect to start flashing.</p>
              <p><strong>Note:</strong> This tool is only needed for flashing firmware on brand new devices or devices that need to be reset. Once the firmware is written, you can use OTA (Over-The-Air) updates for future upgrades.</p>
              <hr />
              {manifests.length > 0 && (
                <div className="mb-3">
                  <h5>Select Firmware:</h5>
                  {manifests.map((manifest, index) => (
                    <div key={index} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="firmware"
                        id={`firmware-${index}`}
                        value={index}
                        checked={selectedIndex === index}
                        onChange={() => setSelectedIndex(index)}
                      />
                      <label className="form-check-label" htmlFor={`firmware-${index}`}>
                        {manifest.name} (Version: {manifest.version})
                      </label>
                    </div>
                  ))}
                  <hr className="my-4" />
                </div>
              )}
              {selectedManifest && (
                <div className="mt-3">
                  <esp-web-install-button
                    manifest={(() => {
                      const json = JSON.stringify(selectedManifest);
                      const blob = new Blob([json], { type: 'application/json' });
                      return URL.createObjectURL(blob);
                    })()}
                  ></esp-web-install-button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-dark text-white p-3 text-center">
        <ul className="list-unstyled d-flex justify-content-center mb-0 gap-1">
            <li><a href="https://www.borneoiot.com" className="text-white">Website</a></li>
            <li>·</li>
            <li><a href="https://docs.borneoiot.com" className="text-white">Online Documentation</a></li>
            <li>·</li>
            <li><a href="https://github.com/borneo-iot/borneo" className="text-white">GitHub</a></li>
        </ul>
        <p className="mb-0">Copyright &copy; 2005 Yunnan BinaryStars Technologies, Co., Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
