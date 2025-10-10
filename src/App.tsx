import { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel,
    // Paper, (unused)
    AppBar,
    Toolbar,
    Alert,
    Divider,
    Button,
    Card,
} from '@mui/material';
import { Language, MenuBook, GitHub, Usb } from '@mui/icons-material';

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
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100%',
            backgroundImage: 'url(/imgs/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Borneo-IoT OSS Web Flasher
                    </Typography>
                    <Button color="inherit" href="https://www.borneoiot.com" startIcon={<Language />}>
                        Website
                    </Button>
                    <Button color="inherit" href="https://docs.borneoiot.com" startIcon={<MenuBook />}>
                        Online Documentation
                    </Button>
                    <Button color="inherit" href="https://github.com/borneo-iot/borneo" startIcon={<GitHub />}>
                        GitHub
                    </Button>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, py: 3, px: 3, maxWidth: '960px', mx: 'auto', width: '100%' }}>
                <Card elevation={2} sx={{ p: 3, mb: 3, width: '100%' }}>

                    <Typography variant="body1" paragraph>
                        Welcome to the Borneo-IoT open-source firmware flashing tool! Please connect a compatible device to this computer, select your device model, and click Connect to start flashing.
                    </Typography>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                            <strong>Note:</strong> This tool is only needed for flashing firmware on brand new devices or devices that need to be reset. Once the firmware is written, you can use OTA (Over-The-Air) updates for future upgrades.
                        </Typography>
                    </Alert>

                    {manifests.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">
                                    <Typography variant="h6">Select Firmware:</Typography>
                                </FormLabel>
                                <RadioGroup
                                    value={selectedIndex?.toString() || ''}
                                    onChange={(event) => setSelectedIndex(parseInt(event.target.value))}
                                >
                                    {manifests.map((manifest, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={index.toString()}
                                            control={<Radio />}
                                            label={`${manifest.name} (Version: ${manifest.version})`}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    )}

                    <Divider />

                    {selectedManifest && (
                        <Box sx={{ mt: 3 }}>
                            <esp-web-install-button
                                manifest={(() => {
                                    const json = JSON.stringify(selectedManifest);
                                    const blob = new Blob([json], { type: 'application/json' });
                                    return URL.createObjectURL(blob);
                                })()}
                            >
                                <Button slot="activate" color="primary" variant="contained" startIcon={<Usb />}>Connect</Button>
                                {/* Replace the original span slots with MUI Alerts for better styling and clarity */}
                                <Box sx={{ mt: 2 }}>
                                    <div slot="unsupported">
                                        <Alert severity="error" sx={{ mb: 1 }}>
                                            Your browser does not support the Web Serial API.
                                            Please use a supported browser (for example, Chrome or Edge).
                                        </Alert>
                                    </div>
                                    <div slot="not-allowed">
                                        <Alert severity="warning">
                                            This page is not served over HTTPS or serial access was not granted.
                                            Please open this page over HTTPS and allow serial port access, then try again.
                                        </Alert>
                                    </div>
                                </Box>
                            </esp-web-install-button>
                        </Box>
                    )}
                </Card>
            </Box>

            <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', p: 3, textAlign: 'center' }}>
                <Typography variant="body2">
                    Copyright &copy; {new Date().getFullYear()} Yunnan BinaryStars Technologies, Co., Ltd. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default App;
