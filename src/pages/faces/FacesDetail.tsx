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

export const FacesDetail: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleScanFace = async () => {
    if (!selectedFile) {
      setErrorMessage("Por favor selecciona una imagen.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/api/ai/escanear-rostro/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("response:",data);
      setRecognitionResult(data);
    } catch (error: any) {
      setErrorMessage(error.message || "Error al reconocer el rostro.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setRecognitionResult(null);
    setErrorMessage(null);
    // Limpiar input file visualmente
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <LayoutBaseDePagina titulo="Reconocimiento Facial">
      <Paper
        sx={{
          margin: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
        }}
        variant="outlined"
      >
        {isLoading && <LinearProgress variant="indeterminate" />}

        <Typography variant="h6">
          Seleccione una imagen para reconocimiento facial
        </Typography>

        <Grid container spacing={2} component="div">
          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <Button
              variant="contained"
              color="primary"
              onClick={handleScanFace}
              disabled={isLoading || !selectedFile}
            >
              Escanear Rostro
            </Button>
          </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClear}
              disabled={isLoading && !selectedFile}
            >
              Limpiar
            </Button>
          </Grid>

          {selectedFile && (
            <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
              <Typography variant="subtitle1">Vista previa:</Typography>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Vista previa"
                style={{ maxWidth: "300px", marginTop: "10px" }}
              />
            </Grid>
          )}

          {recognitionResult && (
            <Grid size={{ xs: 12, sm: 12, md: 6 }} component="div">
              <Typography variant="subtitle1">
                Resultado:{" "}
                {recognitionResult.matched
                  ? "Coincidencia encontrada"
                  : "No hay coincidencia"}
              </Typography>

              {recognitionResult.matched && (
                <>
                  <Typography>
                    Residente: {recognitionResult.resident}
                  </Typography>
                  <Typography>
                    Confianza: {recognitionResult.confidence.toFixed(2)}%
                  </Typography>

                  {recognitionResult.foto && (
                    <>
                      <Typography variant="subtitle2">
                        Foto reconocida:
                      </Typography>
                      <img
                        src={`https://vpay-paybox-bucket.s3.us-east-1.amazonaws.com/faces/${recognitionResult.foto}`}
                        alt="Rostro reconocido"
                        style={{ maxWidth: "300px", marginTop: "10px" }}
                      />
                    </>
                  )}
                </>
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
