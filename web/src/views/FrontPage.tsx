import React, { useCallback, useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUploadFile } from "src/hooks/useUploadFile";
import { getInitialState } from "src/store/treeStore/initialState";

import EmptyState from "@helsenorge/designsystem-react/components/EmptyState";

import Btn from "../components/Btn/Btn";
import Modal from "../components/Modal/Modal";
import QuestionnairesList from "../components/QuestionnairesList/Index";
import SpinnerBox from "../components/Spinner/SpinnerBox";
import {
  getAllQuestionnaires,
  deleteQuestionnaire,
  saveQuestionnaire,
} from "../store/treeStore/indexedDbHelper";
import { resetQuestionnaireAction } from "../store/treeStore/treeActions";
import { TreeContext, TreeState } from "../store/treeStore/treeStore";
import "./FrontPage.css";
import createUUID from '../helpers/CreateUUID';
import StandardQuestionnaire from '../assets/standardfrågor.json';
import { mapToTreeState } from "src/helpers/FhirToTreeStateMapper";

const FrontPage = (): React.JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useContext(TreeContext);

  const { uploadQuestionnaire, isLoading, uploadRef } = useUploadFile({
    onUploadComplete: (id) => navigate(`/formbuilder/${id}`),
  });

  const [questionnaires, setQuestionnaires] = useState<TreeState[]>([]);

  const fetchQuestionnaires = useCallback(async () => {
    try {
      setQuestionnaires(await getAllQuestionnaires(true));
    } catch {
      setQuestionnaires([]);
    }
  }, []);
  useEffect(() => {
    fetchQuestionnaires();
  }, [fetchQuestionnaires]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm(t("Are you sure you want to delete this questionnaire?"))) {
        await deleteQuestionnaire(id);
        fetchQuestionnaires();
      }
    },
    [fetchQuestionnaires, t],
  );
  const handleOpen = async (id: string): Promise<void> => {
    navigate(`/formbuilder/${id}`);
  };
  const handleSetNewQuestionnaire = async (): Promise<void> => {
    const state = getInitialState(true);
    dispatch(resetQuestionnaireAction(state));
    await saveQuestionnaire(state);
    navigate(`/formbuilder/${state.qMetadata.id}`);
  };
  const handleSetStandardQuestionnaire = async (): Promise<void> => {
    
    // reads standard questionnaire from file
    const StandardQuestionnaireParsed = JSON.parse(JSON.stringify(StandardQuestionnaire));

    // resets some metadata properties
    StandardQuestionnaireParsed.title = '';
    StandardQuestionnaireParsed.name = '';
    StandardQuestionnaireParsed.description = '';
    const NewUUID = createUUID();
    StandardQuestionnaireParsed.id = NewUUID;
    StandardQuestionnaireParsed.url = "Questionnaire/" + NewUUID;

    // maps questionnaire to Tree
    const state = mapToTreeState(StandardQuestionnaireParsed);
    dispatch(resetQuestionnaireAction(state));

    await saveQuestionnaire(state);
    navigate(`/formbuilder/${state.qMetadata.id}`);
  };

  return (
    <>
      {isLoading && (
        <Modal>
          <div className="align-everything">
            <SpinnerBox />
          </div>
          <p className="center-text">{t("Loading questionnaire...")}</p>
        </Modal>
      )}

      <header>
        <div className="form-title">
          <h1>{t("Form builder")}</h1>
        </div>
      </header>
      <div className="frontpage">
        <h2>{t("What would you like to do?")}</h2>
        <div className="frontpage__infotext">
          {t("You can start a new questionnaire, or upload an existing one.")}
        </div>
        <input
          type="file"
          ref={uploadRef}
          onChange={uploadQuestionnaire}
          accept="application/json"
          style={{ display: "none" }}
        />
        <Btn
          onClick={handleSetNewQuestionnaire}
          title={t("New empty questionnaire")}
          variant="primary"
        />
        {` `}
        <Btn
          onClick={handleSetStandardQuestionnaire}
          title={t("New standard questionnaire")}
          variant="primary"
        />
        {` `}
        <Btn
          onClick={() => {
            uploadRef.current?.click();
          }}
          title={t("Upload questionnaire")}
          variant="secondary"
        />

        <div className="frontpage__questionnaires-list">
          {questionnaires.length === 0 ? (
            <EmptyState
              type="dashed"
              size="compact"
              title={t(
                "You have no saved questionnaires. Create a new one to get started!",
              )}
            />
          ) : (
            <QuestionnairesList
              data={questionnaires}
              onDelete={handleDelete}
              onOpen={handleOpen}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FrontPage;
