import yaml
import os
from pathlib import Path
from typing import Dict, Any, Optional

class PromptLoader:
    def __init__(self, prompts_dir: Optional[str] = None):
        if prompts_dir:
            self.prompts_dir = Path(prompts_dir)
        else:
            # Default to the directory containing this file
            self.prompts_dir = Path(__file__).parent.absolute()
        
        self._cache: Dict[str, str] = {}

    def get_prompt(self, stage_name: str, version: str = "v1") -> str:
        """
        Loads a prompt from a YAML file. 
        Example: get_prompt("triage") looks for triage.yaml
        """
        cache_key = f"{stage_name}_{version}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        file_path = self.prompts_dir / f"{stage_name}.yaml"
        if not file_path.exists():
            raise FileNotFoundError(f"Prompt file not found: {file_path}")

        with open(file_path, "r") as f:
            data = yaml.safe_load(f)
            
        # Expecting a YAML structure like:
        # v1: |
        #   Your prompt here...
        prompt = data.get(version)
        if not prompt:
            raise KeyError(f"Version '{version}' not found in {file_path}")

        self._cache[cache_key] = prompt.strip()
        return self._cache[cache_key]

# Singleton instance for easy access
prompt_loader = PromptLoader()
