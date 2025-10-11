import { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Radio,
    // Paper, (unused)
    AppBar,
    Toolbar,
    Alert,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
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

                    {manifests.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Select Firmware:</Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ width: '60px' }}>Select</TableCell>
                                            <TableCell align="left" sx={{ minWidth: '150px' }}>Board Name</TableCell>
                                            <TableCell align="left" sx={{ minWidth: '120px' }}>Manufacturer</TableCell>
                                            <TableCell align="left" sx={{ minWidth: '120px' }}>Product ID</TableCell>
                                            <TableCell align="center" sx={{ width: '80px' }}>Version</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {manifests.map((manifest, index) => (
                                            <TableRow
                                                key={index}
                                                onClick={() => setSelectedIndex(index)}
                                                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                                            >
                                                <TableCell align="center">
                                                    <Radio
                                                        checked={selectedIndex === index}
                                                        onChange={() => setSelectedIndex(index)}
                                                    />
                                                </TableCell>
                                                <TableCell align="left">{manifest.board_name}</TableCell>
                                                <TableCell align="left">{manifest.manufacturer}</TableCell>
                                                <TableCell align="left">{manifest.product_id}</TableCell>
                                                <TableCell align="center">{manifest.version}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {selectedManifest && (
                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
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
                            <Alert severity="info" sx={{ flex: 1 }}>
                                <Typography variant="body2">
                                    <strong>Note:</strong> This tool is only needed for flashing firmware on brand new devices or devices that need to be reset. Once the firmware is written, you can use OTA (Over-The-Air) updates for future upgrades.
                                </Typography>
                            </Alert>
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
