import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IngredientService } from '../../../services/ingredient.service';
import { RecipeService } from '../../../services/recipe.serivce';

@Component({
  selector: 'app-modal-cadastro-receita',
  templateUrl: './modal-cadastro-receita.component.html',
  styleUrls: ['./modal-cadastro-receita.component.scss'],
})
export class ModalCadastroReceitaComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() isEditMode = false;
  @Input() recipeId: string | null = null;
  @Input() isDisabled = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onError = new EventEmitter<string>();

  recipe = {
    nome: '',
    descricao: '',
    ingredientes: [{ id: null, quantidade: null }],
  };

  ingredientOptions: { value: string; label: string }[] = [];
  isLoading: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private ingredientService: IngredientService
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isVisible'] &&
      this.isVisible &&
      this.isEditMode &&
      this.recipeId
    ) {
      this.loadRecipeById(this.recipeId);
    }
  }

  loadIngredients(): void {
    this.ingredientService.getIngredients(1, 100).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data?.ingredients) {
          this.ingredientOptions = response.data.ingredients.map(
            (ingredient: any) => ({
              value: ingredient.id,
              label: ingredient.name,
            })
          );
        }
      },
      error: (error) => {
        console.error('Error fetching ingredients:', error);
      },
    });
  }

  loadRecipeById(id: string): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data?.recipe) {
          const recipeData = response.data.recipe;
          this.recipe.nome = recipeData.nome;
          this.recipe.descricao = recipeData.descricao;
          this.recipe.ingredientes = recipeData.ingredients.map(
            (ingredient: any) => ({
              id: ingredient.ingredienteId,
              quantidade: ingredient.quantidadeNecessaria,
            })
          );
        }
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
      },
    });
  }

  addIngredient(): void {
    this.recipe.ingredientes.push({ id: null, quantidade: null });
  }

  removeIngredient(index: number): void {
    this.recipe.ingredientes.splice(index, 1);
  }

  resetRecipe(): void {
    this.recipe = {
      nome: '',
      descricao: '',
      ingredientes: [{ id: null, quantidade: null }],
    };
  }

  closeModal(): void {
    this.onClose.emit();
    this.resetRecipe();
  }

  save(form: any): void {
    if (form.valid) {
      if (!this.recipe.nome || this.recipe.nome.trim() === '') {
        this.onError.emit('O nome da receita é obrigatório.');
        return;
      }

      const hasValidIngredient = this.recipe.ingredientes.some(
        (ingredient) =>
          ingredient.id &&
          ingredient.quantidade !== null &&
          ingredient.quantidade > 0
      );

      if (!hasValidIngredient) {
        this.onError.emit(
          'A receita deve conter pelo menos um ingrediente válido.'
        );
        return;
      }

      const payload = {
        nome: this.recipe.nome,
        descricao: this.recipe.descricao,
        ingredientes: this.recipe.ingredientes.map((ingredient) => ({
          ingredienteId: ingredient.id,
          quantidadeNecessaria: ingredient.quantidade,
        })),
      };

      if (this.isEditMode && this.recipeId) {
        this.updateRecipe(payload);
      } else {
        this.createRecipe(payload);
      }
    } else {
      this.onError.emit(
        'Preencha todos os campos obrigatórios antes de salvar.'
      );
    }
  }

  createRecipe(payload: any): void {
    this.recipeService.createRecipe(payload).subscribe({
      next: (response) => {
        this.recipeService.notifyRecipesUpdated();
        this.onSave.emit(response);
        this.resetRecipe();
        this.closeModal();
      },
      error: () => {
        this.onError.emit('Erro ao criar a receita.');
      },
    });
  }

  updateRecipe(payload: any): void {
    if (!this.recipeId) return;

    this.recipeService.updateRecipe(this.recipeId, payload).subscribe({
      next: (response) => {
        this.recipeService.notifyRecipesUpdated();
        this.onSave.emit(response);
        this.resetRecipe();
        this.closeModal();
      },
      error: (httpErrorResponse) => {
        this.isLoading = false;
        if (
          httpErrorResponse.status === 400 &&
          httpErrorResponse.error &&
          httpErrorResponse.error.errors
        ) {
          this.onError.emit(httpErrorResponse.error.errors);
        } else {
          console.error('Erro inesperado:', httpErrorResponse);
        }
      },
    });
  }
}
