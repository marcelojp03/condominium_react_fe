import { useState } from "react";
import {
  LinearProgress,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LayoutBaseDePagina } from "../../shared/layouts";

export const AlertasDetail: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleScanBehavior = async () => {
    if (!selectedFile) {
      setErrorMessage("Por favor selecciona una imagen.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("imagen", selectedFile); // 👈 el backend espera "imagen"

      const response = await fetch(
        "http://127.0.0.1:8000/api/ai/escanear-comportamiento/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setScanResult(data);
    } catch (error: any) {
      setErrorMessage(error.message || "Error al escanear comportamiento.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setScanResult(null);
    setErrorMessage(null);
    const fileInput = document.getElementById(
      "behavior-file-input"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <LayoutBaseDePagina titulo="Escaneo de Comportamiento">
      <Paper
        sx={{ m: 1, p: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {isLoading && <LinearProgress />}

        <Typography variant="h6">Seleccione una imagen</Typography>

        <Grid container spacing={2} component="div">
          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <input
              id="behavior-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <Button
              variant="contained"
              color="primary"
              onClick={handleScanBehavior}
              disabled={isLoading || !selectedFile}
            >
              Escanear Comportamiento
            </Button>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              Limpiar
            </Button>
          </Grid>

          {scanResult && scanResult.eventos_detectados && (
            <Grid size={{ xs: 12 }} component="div">
              <Typography variant="h6">Eventos detectados:</Typography>
              {scanResult.eventos_detectados.map(
                (evento: any, index: number) => (
                  <Typography key={index}>
                    {evento.tipo_evento} - Confianza:{" "}
                    {evento.confianza.toFixed(2)}%
                  </Typography>
                )
              )}
            </Grid>
          )}
        </Grid>
      </Paper>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </LayoutBaseDePagina>
  );
};
