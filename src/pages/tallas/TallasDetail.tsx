import { useNavigate, useParams } from "react-router-dom";
import { FerramentasDaListagem, FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useState } from "react";
import { useVForm } from "../../shared/forms";

export const TallasDetail: React.FC = () => {
    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
    const { id = 'nuevo' } = useParams<'id'>();
    const navigate = useNavigate();
  
  
    const [isLoading, setIsLoading] = useState(false);
    const [nombre, setNombre] = useState('');
return(
    <LayoutBaseDePagina
        titulo={id === 'nuevo' ? 'Nuevo contacto' : nombre}
        barraDeFerramentas={<FerramentasDeDetalhe
            textoBotaoNovo='Nuevo'
            mostrarBotaoSalvarEFechar
            mostrarBotaoNovo={id !== 'nuevo'}
            mostrarBotaoApagar={id !== 'nuevo'} />} children={undefined}    ></LayoutBaseDePagina>
);
}