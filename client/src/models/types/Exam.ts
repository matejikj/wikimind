/**
 * Represents an exam or test.
 */
export type Exam = {
    /**
     * The unique identifier of the exam.
     */
    id: string;
    
    /**
     * The profile associated with the exam.
     */
    profile: string;
    
    /**
     * The mind map used for the exam.
     */
    mindMap: string;
    
    /**
     * The maximum score achievable in the exam.
     */
    max: number;
    
    /**
     * The result or score obtained in the exam.
     */
    result: number;
  }
  